const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware sentinelle : vérifie "Authorization: Bearer <token>"
exports.protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé : token manquant" });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });
    req.user = user; // disponible dans la route protégée
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
