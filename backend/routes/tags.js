const express = require('express');
const router = express.Router();
const { Tag } = require('../models');


router.get('/', async (req, res) => {
  try {
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
      limit: 10,
      attributes: ['id', 'name'] 
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tags', error: err.message });
  }
});




module.exports = router;