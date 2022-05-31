const express = require("express");
const router = express.Router();

router.get("/status", (req, res) => {
  try {
    return res.json({ status: "OK" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
