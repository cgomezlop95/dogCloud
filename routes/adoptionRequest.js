const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const transporter = require("../config/nodemailer");

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
    const newRequest = await prisma.adoptionRequest.create({
      data: {
        requestApproved: isRequestApproved,
        adopterAge: parseFloat(req.body.adopterAge),
        hasExperience: ifExperience,
        dailyHoursAway: parseFloat(req.body.dailyHoursAway),
        hasOtherPets: ifOtherPets,
        OtherPets: req.body.OtherPets,
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

    let mailOptions = {
      from: "tuemail@gmail.com",
      to: "c.gomezlop95@gmail.com",
      subject: "New adoption request",
      html: `
    <p>Dear admin,</p>
    <p>A new adoption request has been submitted.</p>
    <p>Please click <a href="https://doggyrescue.onrender.com/auth/login-page">here</a> to login.</p>
  `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Correo enviado: " + info.response);
      }
    });

    res.redirect("/my-adoption-requests");
  } catch (error) {
    console.error(error);
    res.json(
      "Server error. Check if you have already submitted an application for this dog."
    );
  }
});

module.exports = router;
