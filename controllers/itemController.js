const Item = require("../models/Item");
const { calculateMatchScore } = require("../services/matchingService");
const { extractKeywords } = require("../utils/textProcessor");

exports.createItem = async (req, res) => {
    try {
        const { title, description, category, location, status } = req.body;
        const combinedText = `${title} ${description}`;
        const autoKeywords = extractKeywords(combinedText);

        const imageUrl = req.file ? req.file.path : null;

        const newItem = new Item({ 
            title, 
            description, 
            category, 
            location, 
            status, 
            keywords: autoKeywords,
            imageUrl: imageUrl,
            postedBy: req.user.id 
        });
        
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchItems = async (req, res) => {
  try {
    const { q, location, category } = req.query;
    let query = {};

    if (q) query.$text = { $search: q };
    if (location) query.location = location;
    if (category) query.category = category;

    const items = await Item.find(query)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findMatches = async (req, res) => {
  try {
    const targetItem = await Item.findById(req.params.id);
    if (!targetItem) return res.status(404).json({ error: "Item not found" });

    const oppositeStatus = targetItem.status === "lost" ? "found" : "lost";
    const potentialMatches = await Item.find({ status: oppositeStatus });

    const scoredMatches = potentialMatches.map((item) => {
      const score = calculateMatchScore(targetItem, item);
      return { item, score };
    });

    const sortedMatches = scoredMatches
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score);

    res.status(200).json(sortedMatches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["lost", "found", "claimed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.postedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this item" });
    }

    item.status = status;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
