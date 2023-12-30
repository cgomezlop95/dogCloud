const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

const upload = require("../config/multer");
const handleUpload = require("../middlewares/handleUpload");

// Route to update the dog details

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
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

router.put("/:id", upload.single("dogPhotoURL"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);

    const isDogAdopted = "dogAdopted" in req.body;
    const isSuitableForKids = "suitableForKids" in req.body;
    const isSuitableForOtherPets = "suitableForOtherPets" in req.body;
    await prisma.dog.update({
      where: { id: req.params.id },
      data: {
        dogName: req.body.dogName,
        dogAge: parseFloat(req.body.dogAge),
        dogWeight: parseFloat(req.body.dogWeight),
        dogSex: req.body.dogSex,
        dogBreed: req.body.dogBreed,
        dogAdopted: isDogAdopted,
        suitableForKids: isSuitableForKids,
        suitableForOtherPets: isSuitableForOtherPets,
        dogDescription: req.body.dogDescription,
        dogPhotoURL: cldRes.secure_url,
      },
    });
    res.redirect(`/dog/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;
