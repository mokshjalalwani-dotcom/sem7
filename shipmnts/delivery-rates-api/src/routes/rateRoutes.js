const express = require('express');
const router = express.Router();
const currentUser = require('../middleware/currentUser');
const { createRate, searchRates } = require('../controllers/rateController');

router.post('/', currentUser, createRate);          // POST /rates
router.post('/search', currentUser, searchRates);   // POST /rates/search

module.exports = router;
