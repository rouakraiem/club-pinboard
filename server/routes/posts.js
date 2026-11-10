const router = require("express").Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { protect } = require("../middleware/auth");

// GET /api/posts?type=annonce  (public)
router.get("/", async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const posts = await Post.find(filter).populate("author", "name").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/posts/:id  (public)
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");
    if (!post) return res.status(404).json({ message: "Publication introuvable" });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
});

// POST /api/posts  (protégé)
router.post("/", protect, async (req, res) => {
  try {
    const { type, title, content, eventDate } = req.body;
    if (!type || !title || !content) return res.status(400).json({ message: "Type, titre et contenu requis" });
    const post = await Post.create({
      type, title, content,
      eventDate: type === "evenement" && eventDate ? eventDate : undefined,
      author: req.user._id,
    });
    res.status(201).json(await post.populate("author", "name"));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/posts/:id  (protégé, uniquement l auteur)
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Publication introuvable" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Tu ne peux supprimer que tes publications" });
    }
    await Comment.deleteMany({ post: post._id }); // supprime aussi les commentaires liés
    await post.deleteOne();
    res.json({ message: "Publication supprimée" });
  } catch (err) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
});

// PUT /api/posts/:id  (protégé, uniquement l auteur)
router.put("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Publication introuvable" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Tu ne peux modifier que tes publications" });
    }
    const { title, content, eventDate } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    if (post.type === "evenement" && eventDate) post.eventDate = eventDate;
    await post.save();
    res.json(await post.populate("author", "name"));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
