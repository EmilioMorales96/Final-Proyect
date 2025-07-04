import express from "express";
import db from "../models/index.js";
import authenticateToken from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all favorite template IDs for the current user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      include: [{ model: db.Template, as: "Favorites", attributes: ["id"] }]
    });
    const favs = user && Array.isArray(user.Favorites) ? user.Favorites.map(t => t.id) : [];
    res.json(favs);
  } catch (err) {
    res.json([]); // Siempre responde un array aunque haya error
  }
});

// Add a template to favorites
router.post("/:templateId", authenticateToken, async (req, res) => {
  const { templateId } = req.params;
  const user = await db.User.findByPk(req.user.id);
  const template = await db.Template.findByPk(templateId);
  if (!template) return res.status(404).json({ message: "Template not found" });
  await user.addFavorite(template);
  res.json({ success: true });
});

// Remove a template from favorites
router.delete("/:templateId", authenticateToken, async (req, res) => {
  const { templateId } = req.params;
  const user = await db.User.findByPk(req.user.id);
  const template = await db.Template.findByPk(templateId);
  if (!template) return res.status(404).json({ message: "Template not found" });
  await user.removeFavorite(template);
  res.json({ success: true });
});

export default router;