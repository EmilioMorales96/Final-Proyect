import express from 'express';
import db from '../models/index.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();
const { Template, Question, Comment, User, Tag } = db;

// Global search endpoint
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters long' });
    }

    const searchTerm = `%${q}%`;
    const results = [];

    // Search in templates
    const templates = await Template.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { title: { [db.Sequelize.Op.iLike]: searchTerm } },
          { description: { [db.Sequelize.Op.iLike]: searchTerm } },
          { topic: { [db.Sequelize.Op.iLike]: searchTerm } }
        ],
        isPublic: true // Only public templates in search
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['username']
        },
        {
          model: Tag,
          attributes: ['name'],
          through: { attributes: [] }
        }
      ],
      limit: 10
    });

    templates.forEach(template => {
      results.push({
        id: template.id,
        type: 'template',
        title: template.title,
        description: template.description,
        author: template.author?.username,
        relevance: calculateRelevance(q, template.title, template.description)
      });
    });

    // Search in questions (from public templates)
    const questions = await Question.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { title: { [db.Sequelize.Op.iLike]: searchTerm } },
          { questionText: { [db.Sequelize.Op.iLike]: searchTerm } }
        ]
      },
      include: [
        {
          model: Template,
          where: { isPublic: true },
          attributes: ['id', 'title'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['username']
            }
          ]
        }
      ],
      limit: 8
    });

    questions.forEach(question => {
      results.push({
        id: question.Template.id,
        type: 'question',
        title: `Question: ${question.title}`,
        description: question.questionText,
        templateTitle: question.Template.title,
        author: question.Template.author?.username,
        relevance: calculateRelevance(q, question.title, question.questionText)
      });
    });

    // Search in comments (from public templates)
    const comments = await Comment.findAll({
      where: {
        content: { [db.Sequelize.Op.iLike]: searchTerm }
      },
      include: [
        {
          model: Template,
          where: { isPublic: true },
          attributes: ['id', 'title']
        },
        {
          model: User,
          attributes: ['username']
        }
      ],
      limit: 5
    });

    comments.forEach(comment => {
      results.push({
        id: comment.Template.id,
        type: 'comment',
        title: `Comment on: ${comment.Template.title}`,
        description: comment.content.substring(0, 100) + '...',
        author: comment.User?.username,
        relevance: calculateRelevance(q, comment.content)
      });
    });

    // Sort by relevance and limit total results
    results.sort((a, b) => b.relevance - a.relevance);
    
    res.json(results.slice(0, 20));
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error performing search', error: error.message });
  }
});

// Function to calculate search relevance
function calculateRelevance(query, ...texts) {
  const queryLower = query.toLowerCase();
  let relevance = 0;
  
  texts.forEach(text => {
    if (!text) return;
    const textLower = text.toLowerCase();
    
    // Exact match in title gets highest score
    if (textLower.includes(queryLower)) {
      relevance += queryLower.length / textLower.length * 100;
    }
    
    // Word matches
    const queryWords = queryLower.split(' ');
    const textWords = textLower.split(' ');
    
    queryWords.forEach(qWord => {
      textWords.forEach(tWord => {
        if (tWord.includes(qWord) && qWord.length > 2) {
          relevance += 10;
        }
      });
    });
  });
  
  return relevance;
}

export default router;
