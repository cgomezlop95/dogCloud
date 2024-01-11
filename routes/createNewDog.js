const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

const upload = require("../config/multer");
const handleUpload = require("../middlewares/handleUpload");

//Route to create and add a new dog to the data base

router.get("/", async (req, res) => {
  try {
    res.render("createNewDog", { user: req.user });
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

router.post("/", upload.single("dogPhotoURL"), async (req, res) => {
  try {
    let dogPhotoURL;
    // Check if a file has been uploaded, this avoids an error in case I do not upload a new pic
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      dogPhotoURL = cldRes.secure_url;
    }

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
        dogPhotoURL: dogPhotoURL,
      },
    });
    res.redirect("/dog/pending");
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;
