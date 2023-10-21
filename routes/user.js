const express = require('express');

const  userController = require('../controllers/user');

const router = express.Router();

router.get('/user/check-user',userController.getUserDetails);

router.post('/user/signUp',userController.postUserDetails);

module.exports = router;

