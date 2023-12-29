const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// const upload = require("../config/multer");
// const handleUpload = require("../middlewares/handleUpload");

// Route to update the dog details

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dogById = await prisma.dog.findUnique({
      where: {
        id,
      },
    });
    res.render("updateDog", {
      dog: dogById,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

router.put("/:id", async (req, res) => {
  console.log("entra");
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
    await prisma.dog.update({
      where: { id: req.params.id },
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
        //dogPhotoURL: cldRes.secure_url,
      },
    });
    res.redirect("/dog");
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;
