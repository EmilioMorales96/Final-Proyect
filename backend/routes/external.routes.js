import express from 'express';
import db from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();
const { User, Template, Form, Question } = db;

/**
 * External API Routes for Odoo Integration
 * Provides aggregated data access via API tokens
 */

/**
 * Middleware to authenticate API token
 */
const authenticateApiToken = async (req, res, next) => {
  try {
    const token = req.headers['x-api-token'];
    
    if (!token) {
      return res.status(401).json({ message: 'API token required' });
    }

    const user = await User.findOne({ where: { apiToken: token } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid API token' });
    }

    req.apiUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Token validation error' });
  }
};

/**
 * Get user's templates with aggregated form data
 * GET /api/external/templates
 */
router.get('/templates', authenticateApiToken, async (req, res) => {
  try {
    const templates = await Template.findAll({
      where: { 
        authorId: req.apiUser.id,
        isPublic: true // Only public templates for external access
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Form,
          attributes: ['id', 'answers', 'createdAt'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Process and aggregate data
    const processedTemplates = templates.map(template => {
      const forms = template.Forms || [];
      const totalResponses = forms.length;
      
      // Parse questions to get structure
      let questions = [];
      try {
        questions = JSON.parse(template.questions || '[]');
      } catch (e) {
        questions = [];
      }

      // Aggregate answers by question
      const questionStats = questions.map((question, index) => {
        const answers = forms.map(form => {
          try {
            const formAnswers = JSON.parse(form.answers || '[]');
            return formAnswers[index];
          } catch (e) {
            return null;
          }
        }).filter(answer => answer !== null && answer !== undefined && answer !== '');

        let aggregation = {};
        
        if (question.type === 'number') {
          const numericAnswers = answers.filter(a => !isNaN(parseFloat(a))).map(a => parseFloat(a));
          if (numericAnswers.length > 0) {
            aggregation = {
              average: numericAnswers.reduce((a, b) => a + b, 0) / numericAnswers.length,
              min: Math.min(...numericAnswers),
              max: Math.max(...numericAnswers),
              count: numericAnswers.length
            };
          }
        } else if (question.type === 'multipleChoice' || question.type === 'checkbox') {
          // Count frequency of each answer
          const frequency = {};
          answers.forEach(answer => {
            if (Array.isArray(answer)) {
              answer.forEach(item => {
                frequency[item] = (frequency[item] || 0) + 1;
              });
            } else {
              frequency[answer] = (frequency[answer] || 0) + 1;
            }
          });
          
          aggregation = {
            frequency,
            mostPopular: Object.entries(frequency).sort((a, b) => b[1] - a[1]).slice(0, 3),
            totalAnswers: answers.length
          };
        } else {
          // For text and other types, just show most common answers
          const frequency = {};
          answers.forEach(answer => {
            const answerStr = String(answer).toLowerCase();
            frequency[answerStr] = (frequency[answerStr] || 0) + 1;
          });
          
          aggregation = {
            frequency,
            mostCommon: Object.entries(frequency).sort((a, b) => b[1] - a[1]).slice(0, 5),
            totalAnswers: answers.length
          };
        }

        return {
          questionText: question.title || question.text,
          questionType: question.type,
          totalAnswers: answers.length,
          aggregation
        };
      });

      return {
        id: template.id,
        title: template.title,
        description: template.description,
        topic: template.topic,
        author: template.author,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        totalResponses,
        questions: questionStats
      };
    });

    res.json({
      user: {
        id: req.apiUser.id,
        username: req.apiUser.username,
        email: req.apiUser.email
      },
      templates: processedTemplates,
      totalTemplates: processedTemplates.length
    });

  } catch (error) {
    console.error('External API error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * Get specific template aggregated data
 * GET /api/external/templates/:id
 */
router.get('/templates/:id', authenticateApiToken, async (req, res) => {
  try {
    const template = await Template.findOne({
      where: { 
        id: req.params.id,
        authorId: req.apiUser.id,
        isPublic: true
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Form,
          attributes: ['id', 'answers', 'createdAt', 'userId'],
          required: false
        }
      ]
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Process detailed aggregation for this template
    const forms = template.Forms || [];
    let questions = [];
    
    try {
      questions = JSON.parse(template.questions || '[]');
    } catch (e) {
      questions = [];
    }

    const detailedStats = questions.map((question, index) => {
      const answers = forms.map(form => {
        try {
          const formAnswers = JSON.parse(form.answers || '[]');
          return {
            answer: formAnswers[index],
            userId: form.userId,
            submittedAt: form.createdAt
          };
        } catch (e) {
          return null;
        }
      }).filter(item => item && item.answer !== null && item.answer !== undefined && item.answer !== '');

      return {
        questionId: index,
        questionText: question.title || question.text,
        questionType: question.type,
        required: question.required || false,
        answers: answers,
        totalAnswers: answers.length
      };
    });

    res.json({
      template: {
        id: template.id,
        title: template.title,
        description: template.description,
        topic: template.topic,
        author: template.author,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        totalResponses: forms.length
      },
      detailedQuestions: detailedStats
    });

  } catch (error) {
    console.error('External API template error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;
