const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/updatedata', authController.updateuser);
router.get('/temp', authController.CreateTempUser);
router.post('/searchuser', authController.getSearchUser);
router.post('/getuser/:userId', authController.getUser);
router.post('/sendmessage', chatController.sendMessage);
router.post('/getmessages', chatController.getChatMessages);
router.get('/userrooms/:userId', chatController.getChatRooms);

module.exports = router;