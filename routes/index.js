const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");

router.get("/", isAuthenticated, function (req, res, next) {
  res.render("index", { title: "Welcome to DoggyRescue" });
});

router.use("/auth", require("./auth"));

router.use("/dog", require("./dog"));
router.use("/request-dog", isAuthenticated, require("./adoptionRequest"));
router.use("/create-new-dog", require("./createNewDog"));
router.use("/update-dog", require("./updateDog"));
router.use(
  "/adoption-requests",
  isAuthenticated,
  require("./adoptionRequestAdminView")
);

module.exports = router;
