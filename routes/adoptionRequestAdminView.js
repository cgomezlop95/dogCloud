const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

router.get("/", async (req, res) => {
  try {
    const adoptionRequestList = await prisma.adoptionRequest.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        dog: {
          select: {
            dogName: true,
          },
        },
      },
    });
    res.render("adoptionRequestAdminView", {
      adoptionRequests: adoptionRequestList,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;
