const express = require('express');

const app = express();

const cors = require('cors');

app.use(cors());

const User = require('./models/userlogin');
const Expense = require('./models/expenses');

const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');

const expenseRoutes = require('./routes/expense');

app.use(bodyParser.json ({extended : false}));

app.use(userRoutes);

app.use(expenseRoutes);

User.hasMany(Expense)
Expense.belongsTo(User);

sequelize.sync()
    .then( result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });


