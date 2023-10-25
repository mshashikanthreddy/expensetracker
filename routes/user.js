const express = require('express');

const  userController = require('../controllers/user');

const router = express.Router();

router.post('/user/login',userController.login);

router.post('/user/signUp',userController.signUp);

module.exports = router;

