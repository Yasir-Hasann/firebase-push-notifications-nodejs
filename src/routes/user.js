// module imports
const express = require('express');

// file imports
const { addUser, updateUser, sendNotifications } = require('../controllers/user');

// variable initializations
const router = express.Router();

router.post('/', addUser);
router.put('/:id', updateUser);
router.post('/notifications', sendNotifications);

module.exports = router;
