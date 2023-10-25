const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.get('/expense/getExpense',expenseController.getExpense);

router.post('/expense/addExpense',expenseController.addExpense);

router.delete('/expense/deleteExpense/:id',expenseController.deleteExpense);

module.exports = router;