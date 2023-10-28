const User = require('../models/userlogin');

const Expense = require('../models/expenses');

//const sequelize = require('../util/database');

const getLeaderBoard = async (req,res) => {

    try{
        const leaderBoardOfUsers = await User.findAll({
           
            order:[['totalExpenses', 'DESC']]

        })

        res.status(200).json(leaderBoardOfUsers)

}

    catch(err) {
        throw new Error(err);
    }
}
   
module.exports = {

    getLeaderBoard
}