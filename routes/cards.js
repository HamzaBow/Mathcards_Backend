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
router.post('/', (req, res) => {
}) 

// Updating One
router.patch('/:id', (req, res) => {
  
}) 

// Deleting One
router.delete('/:id', (req, res) => {
  
}) 

module.exports = router