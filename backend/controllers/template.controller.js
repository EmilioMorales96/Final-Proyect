import db from '../models/index.js';

export const getAllTemplates = async (req, res) => {
  try {
    const templates = await db.Template.findAll({
      include: [
        // ...otros includes...
        {
          model: db.User,
          as: "FavoredBy",
          attributes: [],
          through: { attributes: [] }
        },
        // Incluye tags, autor, etc. si lo necesitas
      ],
      attributes: {
        include: [
          [db.sequelize.fn("COUNT", db.sequelize.col("FavoredBy.id")), "favoritesCount"]
        ]
      },
      group: ["Template.id"],
      order: [["updatedAt", "DESC"]]
    });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: "Error fetching templates", error: err.message });
  }
};