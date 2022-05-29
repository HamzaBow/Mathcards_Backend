const express = require("express");
const auth = require("../services/firebase");
const router = express.Router();
const Card = require("../models/card");
const User = require("../models/user");

// Getting All
router.get("/", async (req, res) => {
  try {
    const cardsIds = req.query.cardsids
    const userId = req.query.userid
    const searchQuery = req.query.q || req.query.query
    let cards
    if (!cardsIds && !userId){
      cards = await Card.find();
    }
    if (!cardsIds && userId){
      cards = await Card.find({ ownerId: req.query.userid });
    }
    if (cardsIds && !userId){
      const ids = cardsIds.split(",");
      cards = await Card.find({'_id': { $in: ids}})
    }
    if (cardsIds && userId){
        throw new Error("CardsIds and userId cannot be both specifined")
        // TODO: send the intersection.
    }
    if (cardsIds === "" || userId === ""){
      cards = []
    }
    if (searchQuery) {
      cards = await Card.find({ "$text": { "$search": searchQuery } });
    }
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
router.post("/", authorizeCreateCard, async (req, res) => {
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
router.put("/:id", getCard, authorizeModifyCard, async (req, res) => {
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
router.patch("/:id", getCard, authorizeModifyCard, async (req, res) => {
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
router.delete("/:id", getCard, authorizeModifyCard, async (req, res) => {
  try {
    await res.card.remove();
    res.json({ message: "Deleted card" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//***********************************************************
//**********************   MIDDLEWARE   *********************
//***********************************************************

async function getCard(req, res, next) {
  let card;
  try {
    card = await Card.findById(req.params.id);
    if (card === null) {
      return res.status(404).json({ message: "Cannot find card" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.card = card;
  next();
}

// this middleware has to be passed after getCard middleware
// because this one uses "res.card" which is  set by getCard middleware.
async function authorizeCreateCard(req, res, next) {
  try {
    const decodedToken = await auth.verifyIdToken(req.headers.authorization?.split(" ")?.[1])
    const authIdFromToken =  decodedToken?.user_id;
    const user = await User.findOne({ authId: authIdFromToken });
    if (user === null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    if (typeof authIdFromToken === "undefined"){
      return res
        .status(401)
        .json({ message: "You are not authorized to execute this operation!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  next()
}

// this middleware has to be passed after getCard middleware
// because this one uses "res.card" which is  set by getCard middleware.
async function authorizeModifyCard(req, res, next) {

  try {
    const decodedToken = await auth.verifyIdToken(req.headers.authorization?.split(" ")?.[1])
    const authIdFromToken =  decodedToken?.user_id;
    const user = await User.findOne({ authId: authIdFromToken });
    if (user === null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    if (
      (typeof authIdFromToken === "undefined") ||
      (res.card.ownerId !== user._id.toString())
    ) {
      return res
        .status(401)
        .json({ message: "You are not authorized to execute this operation!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  next()
}


module.exports = router;
