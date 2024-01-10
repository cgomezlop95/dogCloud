const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("about", { user: req.user });
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;
