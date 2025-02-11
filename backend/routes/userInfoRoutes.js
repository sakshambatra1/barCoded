const express = require('express');
const { addUserInfo } = require('../controllers/userInfoController');

const router = express.Router();

router.post('/addUserInfo', addUserInfo);

module.exports = router; 
