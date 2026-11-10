const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 300 },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // 1 Post -> N Comments
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 1 User -> N Comments
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
