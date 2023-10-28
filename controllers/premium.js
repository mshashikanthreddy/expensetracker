const User = require('../models/userlogin');

const Expense = require('../models/expenses');

//const sequelize = require('../util/database');

const getLeaderBoard = async (req,res) => {

    try{
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregateExpenses = {}

        expenses.forEach((expense) => {

            if(userAggregateExpenses[expense.userId])
            {
                userAggregateExpenses[expense.userId] += expense.amount;
            }
            else
            {
                userAggregateExpenses[expense.userId] = expense.amount;
            }
        })
        var  userLeaderBoardDetails = [];
        users.forEach((user)=> {

            userLeaderBoardDetails.push({name : user.name,totalCost : userAggregateExpenses[user.id] || 0})
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b) => b.totalCost - a.totalCost); // sort in descending order
        res.status(200).json(userLeaderBoardDetails)

    }
    catch(err) {
        throw new Error(err);
    }
}
   
module.exports = {

    getLeaderBoard
}