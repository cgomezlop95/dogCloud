const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
//const isAuthenticated = require("../middlewares/isAuthenticated");

// Route to request the adoption for one dog (view the form and add the request to the DB)

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

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dogById = await prisma.dog.findUnique({
      where: {
        id,
      },
    });
    const isRequestApproved = "requestApproved" in req.body;
    const ifExperience = "hasExperience" in req.body;
    const ifOtherPets = "hasOtherPets" in req.body;
    const ifKids = "hasKids" in req.body;
    const ifGarden = "hasGarden" in req.body;
    //console.log(req.user);
    await prisma.adoptionRequest.create({
      data: {
        requestApproved: isRequestApproved,
        adopterAge: parseFloat(req.body.adopterAge),
        hasExperience: ifExperience,
        dailyHoursAway: parseFloat(req.body.dailyHoursAway),
        hasOtherPets: ifOtherPets,
        hasKids: ifKids,
        hasGarden: ifGarden,
        numberOfTrips: parseFloat(req.body.numberOfTrips),
        monthlyMoney: parseFloat(req.body.monthlyMoney),
        numberOfPeople: parseFloat(req.body.numberOfPeople),
        adopterDescription: req.body.adopterDescription,
        userId: req.user.id,
        dogId: dogById.id,
      },
    });
    res.redirect("/dog");
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;
