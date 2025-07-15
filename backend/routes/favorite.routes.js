import express from "express";
import db from "../models/index.js";
import authenticateToken from "../middleware/auth.middleware.js";

const router = express.Router();

// Debug route to test favorites endpoint
router.get('/debug/test', (req, res) => {
  res.json({ 
    message: 'Favorites routes are working',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /api/favorites',
      'POST /api/favorites (templateId in body)',
      'DELETE /api/favorites (templateId in body)',
      'POST /api/favorites/:templateId',
      'DELETE /api/favorites/:templateId'
    ]
  });
});

// Get all favorite template IDs for the current user
router.get("/", authenticateToken, async (req, res) => {
  console.log("User in /api/favorites:", req.user);
  try {
    const user = await db.User.findByPk(req.user.id, {
      include: [{ model: db.Template, as: "Favorites", attributes: ["id"] }]
    });
    const favs = user && Array.isArray(user.Favorites) ? user.Favorites.map(t => t.id) : [];
    res.json(favs);
  } catch (err) {
    console.error("Error in /api/favorites:", err);
    res.json([]);
  }
});

// Add a template to favorites (with templateId in body)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { templateId } = req.body;
    console.log(`[FAVORITES] User ${req.user.id} adding template ${templateId} to favorites`);
    
    if (!templateId) {
      return res.status(400).json({ message: "Template ID is required" });
    }
    
    const user = await db.User.findByPk(req.user.id);
    const template = await db.Template.findByPk(templateId);
    
    if (!template) {
      console.log(`[FAVORITES] Template ${templateId} not found`);
      return res.status(404).json({ message: "Template not found" });
    }
    
    await user.addFavorite(template);
    console.log(`[FAVORITES] Template ${templateId} added to favorites for user ${req.user.id}`);
    res.json({ success: true, message: "Template added to favorites" });
  } catch (err) {
    console.error("[FAVORITES] Error adding to favorites:", err);
    res.status(500).json({ message: "Error adding to favorites", error: err.message });
  }
});

// Remove a template from favorites (with templateId in body)
router.delete("/", authenticateToken, async (req, res) => {
  try {
    const { templateId } = req.body;
    console.log(`[FAVORITES] User ${req.user.id} removing template ${templateId} from favorites`);
    
    if (!templateId) {
      return res.status(400).json({ message: "Template ID is required" });
    }
    
    const user = await db.User.findByPk(req.user.id);
    const template = await db.Template.findByPk(templateId);
    
    if (!template) {
      console.log(`[FAVORITES] Template ${templateId} not found`);
      return res.status(404).json({ message: "Template not found" });
    }
    
    await user.removeFavorite(template);
    console.log(`[FAVORITES] Template ${templateId} removed from favorites for user ${req.user.id}`);
    res.json({ success: true, message: "Template removed from favorites" });
  } catch (err) {
    console.error("[FAVORITES] Error removing from favorites:", err);
    res.status(500).json({ message: "Error removing from favorites", error: err.message });
  }
});

// Add a template to favorites (with templateId in URL params)
router.post("/:templateId", authenticateToken, async (req, res) => {
  const { templateId } = req.params;
  const user = await db.User.findByPk(req.user.id);
  const template = await db.Template.findByPk(templateId);
  if (!template) return res.status(404).json({ message: "Template not found" });
  await user.addFavorite(template);
  res.json({ success: true });
});

// Remove a template from favorites (with templateId in URL params)
router.delete("/:templateId", authenticateToken, async (req, res) => {
  const { templateId } = req.params;
  const user = await db.User.findByPk(req.user.id);
  const template = await db.Template.findByPk(templateId);
  if (!template) return res.status(404).json({ message: "Template not found" });
  await user.removeFavorite(template);
  res.json({ success: true });
});

export default router;