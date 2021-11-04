const express = require('express');
const router = express.Router()
const Collection = require('../models/collection')
// const Card = require('../models/card')

// Getting All
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections)
  } catch (error) {
    res.status(500).json({ error: error})
  }
}) 

// Getting One
router.get('/:id', getCollection, (req, res) => {
  res.json(res.collection)
}) 

// Creating One
router.post('/', async (req, res) => {
  const collection = new Collection({
    title: req.body.title,
    ownerId: req.body.ownerId,
    cardsIds: req.body.cardsIds,
    tags: req.body.tags,
  })
  try {
    const newCollection = await collection.save()
    res.status(201).json(newCollection)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}) 

// Updating One
router.put('/:id', getCollection, async (req, res) => {
  res.collection.title = req.body.title
  res.collection.ownerId = req.body.ownerId
  res.collection.cardsIds = req.body.cardsIds
  res.collection.tags = req.body.tags
  try {
    const updatedCollection = await res.collection.save()
    res.json(updatedCollection)
  } catch (error) {
    res.status(400).json({ message: error.message})
  }
})

// Updating one with PATCH
router.patch('/:id', getCollection, async (req, res) => {
  if (req.body.title != null) {
    res.collection.title = req.body.title
  }
  if (req.body.ownerId != null) {
    res.collection.ownerId = req.body.ownerId
  }
  if (req.body.cardsIds != null) {
    res.collection.cardsIds = req.body.cardsIds
  }
  if (req.body.tags != null) {
    res.collection.tags = req.body.tags
  }

  try {
    const updatedCollection = await res.collection.save()
    res.json(updatedCollection)
  } catch (error) {
    res.status(400).json({ message: error.message})
  }
}) 

// Deleting One
router.delete('/:id', getCollection, async (req, res) => {
  try {
    await res.collection.remove()
    res.json({ message: 'Deleted collection'})
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}) 

//***********************************************************
//***************   CARDS INSIDE COLLECTION   ***************
//***********************************************************
// Adding one card to a specific collection.
router.post('/:id/cards', getCollection, async (req, res) => {
  try {
    if(res.collection.cardsIds.indexOf(req.body.cardId) === - 1){
      res.collection.cardsIds.push(req.body.cardId)
      res.collection.save()
      res.status(201).json('Card added to collection successfully')
    } else {
      res.status(409).json('card already exists in collection')
    }
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
})

// Deleting one card from a specific collection.
router.delete('/:id/cards', getCollection, async (req, res) => {
  try {
    if(res.collection.cardsIds.indexOf(req.body.cardId) !== - 1){
      res.collection.cardsIds = res.collection.cardsIds.filter((id) => id !== req.body.cardId)
      res.collection.save()
      res.json('Card deleted from collection successfully')
    } else {
      res.status(404).json('card does not exist in collection')
    }
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
})

//***********************************************************
//**********************   MIDDLEWARE   *********************
//***********************************************************

async function getCollection(req, res, next) {
  let collection
  try {
    collection = await Collection.findById(req.params.id)
    if(collection == null) {
      return res.status(404).json({ message: "Cannot find collection"})
    }
  } catch (error) {
    return res.status(500).json({ message: error.message})
  }

  res.collection = collection
  next()
}

module.exports = router