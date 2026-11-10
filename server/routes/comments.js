const router = require("express").Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { protect } = require("../middleware/auth");

// GET /api/comments/post/:postId  (public)
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "name")
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
});

// POST /api/comments  (protégé)
router.post("/", protect, async (req, res) => {
  try {
    const { text, post } = req.body;
    if (!text || !post) return res.status(400).json({ message: "Texte et publication requis" });
    if (!(await Post.exists({ _id: post }))) return res.status(404).json({ message: "Publication introuvable" });
    const comment = await Comment.create({ text, post, author: req.user._id });
    res.status(201).json(await comment.populate("author", "name"));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/comments/:id  (protégé, uniquement l auteur)
router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Commentaire introuvable" });
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Action non autorisée" });
    }
    await comment.deleteOne();
    res.json({ message: "Commentaire supprimé" });
  } catch (err) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
});

module.exports = router;
