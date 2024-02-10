const express = require('express');
const router = express.Router();
const { addUser, updateUser, sendNotifications } = require('../controllers/user');

router.post('/', addUser);
router.put('/:id', updateUser);
router.post('/notifications', sendNotifications)

module.exports = router;
