const express = require('express');
const router = express.Router()
const Card = require('../models/card')

// Getting All
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards)
  } catch (error) {
    res.status(500).json({ error: error})
  }
}) 

// Getting One
router.get('/:id', getCard, (req, res) => {
  res.json(res.card)
}) 

// Creating One
router.post('/', async (req, res) => {
  const card = new Card({
    front: req.body.front,
    back: req.body.back,
    difficultyLevels: req.body.difficultyLevels,
    tags: req.body.tags,
  })
  try {
    const newCard = await card.save()
    res.status(201).json(newCard)
  } catch (error) {
    res.status(400).json({ messge: error.message })
  }
}) 

// Updating One
router.patch('/:id', (req, res) => {
  
}) 

// Deleting One
router.delete('/:id', (req, res) => {
  
}) 


async function getUser(req, res, next) {
  let card
  try {
    card = await Card.findById(req.params.id)
    if(card == null) {
      return res.status(404).json({ message: "Cannot find card"})
    }
  } catch (error) {
    return res.status(500).json({ message: error.message})
  }

  res.card = card
  next()
}

module.exports = router