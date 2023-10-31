const express = require('express');

const passwordController = require('../controllers/resetpassword');

const router = express.Router();

router.get('/password/updatepassword/:resetpasswordid',passwordController.updatepassword);

router.get('/password/resetpassword/:id',passwordController.resetpassword);

router.use('/password/forgotpassword',passwordController.passwordRequest);

module.exports = router;