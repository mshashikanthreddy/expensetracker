const express = require('express');

const app = express();

const cors = require('cors');

app.use(cors());

const User = require('./models/userlogin');
const Expense = require('./models/expenses');
const Order = require('./models/orders');

const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');

const expenseRoutes = require('./routes/expense');

const purchaseRoutes = require('./routes/purchase');

app.use(bodyParser.json ({extended : false}));

const dotenv = require('dotenv');

dotenv.config();

app.use(userRoutes);

app.use(expenseRoutes);

app.use(purchaseRoutes);

User.hasMany(Expense)
Expense.belongsTo(User);

User.hasMany(Order)
Order.belongsTo(User);

sequelize.sync()
    .then( result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });


