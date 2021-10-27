const express = require('express');
const router = express.Router()
const Card = require('../models/card')

// Getting All
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards)
  } catch (error) {
    
  }
}) 

// Getting One
router.get('/:id', (req, res) => {
  
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

module.exports = router