// A "route" file just maps a URL + HTTP method to a controller function.
// No logic lives here on purpose — that keeps this file easy to scan.

const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

router.post('/', createUser); // POST /users

module.exports = router;
