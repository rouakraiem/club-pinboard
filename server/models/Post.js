const mongoose = require("mongoose");

// Une "épingle" sur le tableau du club : annonce, événement, idée ou témoignage
const postSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["annonce", "evenement", "idee", "temoignage"], required: true },
    title: { type: String, required: true, trim: true, maxlength: 90 },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    eventDate: { type: Date }, // utilisée seulement pour les événements
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 1 User -> N Posts
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
