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

//Route to view only one adoption request

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const [userId, dogId] = id.split("_"); // Assuming the format is userId_dogId
  try {
    const singleAdoptionRequest = await prisma.adoptionRequest.findUnique({
      where: {
        userId_dogId: {
          userId,
          dogId,
        },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        dog: {
          select: {
            dogName: true,
            dogAge: true,
            dogWeight: true,
            dogSex: true,
            dogBreed: true,
            suitableForKids: true,
            suitableForOtherPets: true,
            dogDescription: true,
            dogPhotoURL: true,
          },
        },
      },
    });
    console.log(singleAdoptionRequest);
    res.render("singleAdoptionRequest", {
      adoptionRequest: singleAdoptionRequest,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;
