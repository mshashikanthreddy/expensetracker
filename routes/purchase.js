const express = require('express');

const  purchaseController = require('../controllers/purchase');

const userAuthentication = require('../middleware/auth')

const router = express.Router();

router.get("/purchase/premiumUser",userAuthentication.verification , purchaseController.purchasePremium);

router.post("/purchase/updateTransactionstatus", userAuthentication.verification , purchaseController.updateTransactionStatus);

module.exports = router;
