const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  responders: [
    {
      ip: { type: String },
      type: { type: String, enum: ["like", "dislike"] },
    },
  ],
});

module.exports = mongoose.model("Poll", pollSchema);
