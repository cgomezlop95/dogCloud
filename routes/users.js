const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

//Route for the admin to view all the users registered in the site

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.render("users", { users: users, user: req.user, title: "DoggyRescue" });
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

module.exports = router;

//Route for the admin to view the details for one user

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userById = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    res.render("userProfile", {
      userById: userById,
      user: req.user,
      title: "DoggyRescue",
    });
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});

//Route for the admin to give admin rights to the user

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isAdmin: true,
      },
    });
    res.redirect("/user");
  } catch (error) {
    console.error(error);
    res.json("Server error");
  }
});
