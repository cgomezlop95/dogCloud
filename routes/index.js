const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", isAuthenticated, function (req, res, next) {
  res.render("index", { title: "Welcome to DoggyRescue", user: req.user });
});

router.use("/auth", require("./auth"));
router.use("/about-us", require("./about"));
router.use("/dog", require("./dog"));
router.use("/request-dog", isAuthenticated, require("./adoptionRequest"));
router.use(
  "/create-new-dog",
  [isAuthenticated, isAdmin],
  require("./createNewDog")
);
router.use("/update-dog", [isAuthenticated, isAdmin], require("./updateDog"));
router.use(
  "/adoption-requests",
  [isAuthenticated, isAdmin],
  require("./adoptionRequestAdminView")
);
router.use(
  "/my-adoption-requests",
  isAuthenticated,
  require("./myAdoptionRequests")
);

//Only authenticated admins can create new dogs, update the dog details and view all the adoption requests

module.exports = router;
