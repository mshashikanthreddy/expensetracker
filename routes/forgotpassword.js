const express = require('express');

const passwordController = require('../controllers/forgotpassword');

//const userAuthentication = require('../middleware/auth')

const router = express.Router();

router.post('/password/forgotpassword',passwordController.passwordRequest);

module.exports = router;