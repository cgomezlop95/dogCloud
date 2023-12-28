const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/', isAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Welcome to DoggyRescue' });
});

router.use('/auth', require('./auth'));
router.use('/dog', require('./dog')); //Cris
router.use('/adoption-requests', require('./adoptionRequest')); //Cris

module.exports = router;
