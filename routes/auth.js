const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");
const prisma = require("../prisma");
const transporter = require("../config/nodemailer");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user by saving their email and hashed password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *     responses:
 *       302:
 *         description: Redirects to the login page on success.
 *       500:
 *         description: Redirects to the registration page on error.
 */
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
      },
    });

    let mailOptions = {
      from: "tuemail@gmail.com",
      to: "c.gomezlop95@gmail.com",
      subject: "Welcome to DoggyRescue",
      html: `
    <p>Welcome to DoggyRescue!</p>
    <p>Your account has been created with the email ${newUser.email}.</p>
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

    res.redirect("/auth/login-page");
  } catch (error) {
    console.log(error);
    res.redirect("/auth/register-page");
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Logs in a user using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *     responses:
 *       302:
 *         description: Redirects to the home page on success, login page on failure.
 */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login-page",
    failureFlash: true,
  })
);

/**
 * @swagger
 * /auth/login-page:
 *   get:
 *     summary: Login page
 *     description: Renders the login page.
 *     responses:
 *       200:
 *         description: Returns the login page.
 */
router.get("/login-page", (req, res) => {
  res.render("login", { error: req.flash("error") });
});

/**
 * @swagger
 * /auth/register-page:
 *   get:
 *     summary: Registration page
 *     description: Renders the registration page.
 *     responses:
 *       200:
 *         description: Returns the registration page.
 */
router.get("/register-page", (req, res) => {
  res.render("register", { error: req.flash("error") });
});

//Cris: Added logout

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
