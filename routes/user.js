const express = require('express');

const  userController = require('../controllers/user');

const router = express.Router();

router.post('/user/login',userController.checkUserDetails);

router.post('/user/signUp',userController.postUserDetails);

module.exports = router;

