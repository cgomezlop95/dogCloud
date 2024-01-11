const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

//To view all the approved requests

router.get("/approved", async (req, res) => {
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

//To view all the pending approvals

router.get("/pending", async (req, res) => {
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
    res.render("adoptionRequestAdminViewPending", {
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
            isAdmin: true,
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
    res.render("singleAdoptionRequest", {
      adoptionRequest: singleAdoptionRequest,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

//Route for the admin to delete one request

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [userId, dogId] = id.split("_"); // Assuming the format is userId_dogId
    await prisma.adoptionRequest.delete({
      where: {
        userId_dogId: {
          userId,
          dogId,
        },
      },
    });
    res.redirect("/adoption-requests");
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

//Route for the admin to approve the request

router.put("/approve/:id", async (req, res) => {
  const { id } = req.params;
  const [userId, dogId] = id.split("_"); // Assuming the format is userId_dogId
  try {
    await prisma.adoptionRequest.update({
      where: {
        userId_dogId: {
          userId: userId,
          dogId: dogId,
        },
      },
      data: {
        requestApproved: true,
      },
    });
    await prisma.dog.update({
      where: {
        id: dogId,
      },
      data: {
        dogAdopted: true,
      },
    });
    res.redirect("/adoption-requests/pending");
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;
