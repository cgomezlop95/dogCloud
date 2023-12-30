const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Route to request the adoption for one dog

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dogById = await prisma.dog.findUnique({
      where: {
        id,
      },
    });
    res.render("adoptionRequest", {
      dog: dogById,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;