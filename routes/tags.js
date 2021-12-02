const express = require("express");
const router = express.Router();
const Card = require("../models/card");

// Getting All
router.get("/", async (req, res) => {
  try {
    const tags = await Card.aggregate([
      { $project: { tags: 1, _id: 0 } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { title: "$_id", count: "$count", _id: 0 } },
    ]);
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
