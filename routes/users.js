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
router.get("/:id", getUser, async (req, res) => {
  res.json(res.user)
});

// Creating One
router.post("/", async (req, res) => {
  try {
    const existingUser = await User.findOne({ uid: req.body.uid })
    if(existingUser){
      res.status(409).json({ message: 'User already exists'})
    } else {
      const user = new User({
        uid: req.body.uid,
        following: req.body.following,
        collectionsIds: req.body.collectionsIds
      })
      const newUser = await user.save()
      res.status(201).json(newUser)
    }
  } catch (error) {
    res.status(400).json({ messge: error.message })
  }
});

// Updating One
router.patch("/:id", getUser, async (req, res) => {
  res.user.uid = req.body.uid;
  res.user.following = req.body.following;
  res.user.collectionsIds = req.body.collectionsIds;
  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: error.message})
  }
});

// Updating one with PATCH
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.uid != null) {
    res.user.uid = req.body.uid;
  }
  if (req.body.following != null) {
    res.user.following = req.body.following
  }
  if (req.body.collectionsIds != null) {
    res.user.collectionsIds = req.body.collectionsIds
  }

  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: error.message})
  }
}) 

// Deleting One
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: 'Deleted user'})
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}) 

//***********************************************************
//**********************   FOLLOWING   **********************
//***********************************************************

router.post('/:id/following', getUser, async (req, res) => {
  try {
    if (res.user.following.indexOf(req.body.followedId) === -1) {
      res.user.following.push(req.body.followedId);
      const user = await res.user.save();
      res.status(201).json({
        message: "followed added to user successfully",
        user: user,
      });
    } else {
      res.status(409).json("followed already exists for this user");
    }
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
})

// Deleting one follower
router.delete('/:id/following', getUser, async (req, res) => {
  try {
    if(res.user.following.indexOf(req.body.followedId) !== - 1){
      res.user.following = res.user.following.filter((id) => id !== req.body.followedId)
      const user = await res.user.save()
      res.json({ message: 'followed deleted from user successfully', user })
    } else {
      res.status(404).json({ message: "followed does not exist in user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
})

//***********************************************************
//***************   COLLECTIONS INSIDE USER   ***************
//***********************************************************

// Adding one collection to user
router.post('/:id/collections', getUser, async (req, res) => {
  try {
    if(res.user.collectionsIds.indexOf(req.body.collectionId) === - 1){
      res.user.collectionsIds.push(req.body.collectionId)
      const user = await res.user.save()
      res.status(201).json({
        message: "collection added to user successfully",
        user,
      });
    } else {
      res.status(409).json('collection already exists for this user')
    }
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
})

// Deleting one collection from user.
router.delete('/:id/collections', getUser, async (req, res) => {
  try {
    if(res.user.collectionsIds.indexOf(req.body.collectionId) !== - 1){
      res.user.collectionsIds = res.user.collectionsIds.filter((id) => id !== req.body.collectionId)
      const user = await res.user.save()
      res.json({
        message: "collection deleted from user successfully",
        user,
      });
    } else {
      res.status(404).json('collection does not exist in user')
    }
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
})

//***********************************************************
//**********************   MIDDLEWARE   *********************
//***********************************************************

async function getUser(req, res, next) {
  let user
  try {
    user = await User.findById(req.params.id)
    if(user == null) {
      return res.status(404).json({ message: "Cannot find user"})
    }
  } catch (error) {
    return res.status(500).json({ message: error.message})
  }

  res.user = user
  next()
}

module.exports = router;
