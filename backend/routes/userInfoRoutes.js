const express = require('express');
const { addUserInfo, getUserInfo } = require('../controllers/userInfoController');

const router = express.Router();

router.post('/addUserInfo', addUserInfo);
router.get('/getUserInfo', getUserInfo);

module.exports = router; 
