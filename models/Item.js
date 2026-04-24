const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ["lost", "found", "claimed"],
    default: "lost",
  },
  keywords: [{ type: String }],
  imageUrl: { type: String },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

itemSchema.index({ title: "text", description: "text", keywords: "text" });

module.exports = mongoose.model("Item", itemSchema);
