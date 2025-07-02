const express = require('express');
const router = express.Router();
const { Tag } = require('../models');

// GET /api/tags?search=something
router.get('/', async (req, res) => {
  const { search } = req.query;
  let where = {};
  if (search) {
    where = {
      name: { [require('sequelize').Op.iLike]: `%${search}%` }
    };
  }
  const tags = await Tag.findAll({
    where,
    order: [['name', 'ASC']],
    limit: 20
  });
  res.json(tags);
});

module.exports = router;