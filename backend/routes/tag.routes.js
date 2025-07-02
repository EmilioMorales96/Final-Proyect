import express from 'express';
import db from '../models/index.js';
const { Template } = db;

const router = express.Router();

// GET /api/tags?search=algo
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const templates = await Template.findAll({ attributes: ['tags'] });
    let tags = [];
    templates.forEach(t => {
      if (t.tags) {
        tags = tags.concat(
          t.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
        );
      }
    });
    // Únicos y filtrados por búsqueda
    let uniqueTags = [...new Set(tags)];
    if (search) {
      uniqueTags = uniqueTags.filter(tag =>
        tag.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Devuelve como array de objetos { name }
    res.json(uniqueTags.map(tag => ({ name: tag })));
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tags.', error: err.message });
  }
});

// Nube de tags (devuelve tags únicos y su frecuencia)
router.get('/cloud', async (req, res) => {
  try {
    const templates = await Template.findAll({ attributes: ['tags'] });
    let tags = [];
    templates.forEach(t => {
      if (t.tags) {
        tags = tags.concat(
          t.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
        );
      }
    });
    // Cuenta frecuencia
    const tagCount = {};
    tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
    // Devuelve array de objetos { tag, count }
    const cloud = Object.entries(tagCount).map(([tag, count]) => ({ tag, count }));
    res.json(cloud);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la nube de tags.', error: err.message });
  }
});

// POST /api/tags
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ message: 'Falta el nombre del tag.' });
  }
  // En este modelo, no se guarda el tag en una tabla aparte, solo se valida y responde
  res.json({ name: name.trim() });
});

export default router;