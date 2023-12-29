const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

//Route to create and add a new dog to the data base

router.get("/", async (req, res) => {
  try {
    res.render("createNewDog");
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      dogName,
      dogAge,
      dogWeight,
      dogSex,
      dogBreed,
      dogAdopted,
      suitableForKids,
      suitableForOtherPets,
      dogDescription,
    } = req.body;
    const isDogAdopted = dogAdopted === "on" ? true : false;
    const isSuitableForKids = suitableForKids === "on" ? true : false;
    const isSuitableForOtherPets = suitableForOtherPets === "on" ? true : false;
    const dogAgeFloat = parseFloat(dogAge);
    const dogWeightFloat = parseFloat(dogWeight);
    await prisma.dog.create({
      data: {
        dogName,
        dogAge: dogAgeFloat,
        dogWeight: dogWeightFloat,
        dogSex,
        dogBreed,
        dogAdopted: isDogAdopted,
        suitableForKids: isSuitableForKids,
        suitableForOtherPets: isSuitableForOtherPets,
        dogDescription,
      },
    });
    res.redirect("/dog");
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;
