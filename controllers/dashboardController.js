const Item = require("../models/Item");

exports.getStats = async (req, res) => {
  try {
    const stats = await Item.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      lost: 0,
      found: 0,
      claimed: 0,
      total: 0,
    };

    stats.forEach((stat) => {
      if (formattedStats[stat._id] !== undefined) {
        formattedStats[stat._id] = stat.count;
      }
      formattedStats.total += stat.count;
    });

    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
