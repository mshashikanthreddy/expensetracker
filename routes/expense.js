const express = require('express');

const expenseController = require('../controllers/expense');

const userAuthentication = require('../middleware/auth')

const router = express.Router();

router.get('/expense/getExpense',userAuthentication.verification ,expenseController.getExpense);

router.post('/expense/addExpense',userAuthentication.verification , expenseController.addExpense);

router.delete('/expense/deleteExpense/:id',userAuthentication.verification , expenseController.deleteExpense);

module.exports = router;