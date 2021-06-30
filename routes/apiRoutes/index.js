const router = require('express').Router();
const animalRoutes = require('./animalRoutes');

router.use(animalRoutes);

module.exports = router;