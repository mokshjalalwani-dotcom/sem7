const express = require('express');
const router = express.Router();
const currentUser = require('../middleware/currentUser');
const { sendConnectionRequest, respondToConnection } = require('../controllers/connectController');

router.post('/', currentUser, sendConnectionRequest);        // POST /connect
router.patch('/respond', currentUser, respondToConnection);  // PATCH /connect/respond

module.exports = router;
