const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Getting All
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting One
router.get("/:id", (req, res) => {
  res.send("User: " + req.params.id);
});

// Creating One
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    following: req.body.following
  })
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.status(400).json({ messge: error.message })
  }
});

// Updating One
router.patch("/:id", (req, res) => {});

// Deleting One
router.delete("/:id", (req, res) => {});

module.exports = router;
