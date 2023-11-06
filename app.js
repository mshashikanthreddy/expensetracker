const express = require('express');

const fs = require('fs');

const path = require('path');

const app = express();

const dotenv = require('dotenv');

dotenv.config();

const cors = require('cors');

app.use(cors());

const User = require('./models/userlogin');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword')

const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');

const expenseRoutes = require('./routes/expense');

const purchaseRoutes = require('./routes/purchase');

const premiumRoutes = require('./routes/premium');

const passwordRoutes = require('./routes/resetpassword');

const helmet = require('helmet');

const compression = require('compression');

const morgan = require('morgan');

app.use(bodyParser.json ({extended : false}));


app.use(userRoutes);

app.use(expenseRoutes);

app.use(purchaseRoutes);

app.use(premiumRoutes);

app.use(passwordRoutes);

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags : 'a'}
    );

app.use(helmet());

app.use(compression());

app.use(morgan('combined', {stream : accessLogStream}))

User.hasMany(Expense)
Expense.belongsTo(User);

User.hasMany(Order)
Order.belongsTo(User);

User.hasMany(Forgotpassword)
Forgotpassword.belongsTo(User);

sequelize.sync()
    .then( result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });


