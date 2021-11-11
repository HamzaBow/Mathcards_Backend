const { json } = require("express");
const express = require("express");
const router = express.Router();
const Card = require("../models/card");

// Getting All
router.get("/", async (req, res) => {
  try {
    const cardsIds = req.query.cardsids
    const userId = req.query.userid
    let cards
    if (typeof cardsIds == "undefined"){
      if (typeof userId == "undefined"){
        cards = await Card.find();
      } else {
        cards = await Card.find({ ownerId: req.query.userid });
      }
    } else {
      if (typeof userId != "undefined"){
        throw new Error("CardsIds and userId cannot be both specifined")
        // TODO: send the intersection.
      } else {
        if (cardsIds === "") {
          cards = []
        } else {
          const ids = cardsIds.split(",");
          cards = await Card.find({'_id': { $in: ids}})
        }
      }
    }
    // if both cards
    res.json(cards);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting One
router.get("/:id", getCard, (req, res) => {
  res.json(res.card);
});

// Creating One
router.post("/", async (req, res) => {
  const card = new Card({
    ownerId           : req.body.ownerId,
    front             : req.body.front,
    back              : req.body.back,
    difficultyLevels  : req.body.difficultyLevels,
    tags              : req.body.tags,
  });
  try {
    const newCard = await card.save();
    res.status(201).json(newCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Updating One
router.put("/:id", getCard, async (req, res) => {
  res.card.ownerid          = req.body.ownerid;
  res.card.front            = req.body.front;
  res.card.back             = req.body.back;
  res.card.difficultyLevels = req.body.difficultyLevels;
  res.card.tags             = req.body.tags;
  try {
    const updatedCard = await res.card.save();
    res.json(updatedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Updating one with PATCH
router.patch("/:id", getCard, async (req, res) => {
  if (req.body.ownerId != null) {
    res.card.ownerId = req.body.ownerId;
  }
  if (req.body.front != null) {
    res.card.front = req.body.front;
  }
  if (req.body.back != null) {
    res.card.back = req.body.back;
  }
  if (req.body.difficultyLevels != null) {
    res.card.difficultyLevels = req.body.difficultyLevels;
  }
  if (req.body.tags != null) {
    res.card.tags = req.body.tags;
  }

  try {
    const updatedCard = await res.card.save();
    res.json(updatedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleting One
router.delete("/:id", getCard, async (req, res) => {
  try {
    await res.card.remove();
    res.json({ message: "Deleted card" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getCard(req, res, next) {
  let card;
  try {
    card = await Card.findById(req.params.id);
    if (card == null) {
      return res.status(404).json({ message: "Cannot find card" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.card = card;
  next();
}

module.exports = router;
