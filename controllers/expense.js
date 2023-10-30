const Expense = require('../models/expenses');

const User = require('../models/userlogin');

const sequelize = require('../util/database');


function isValid(str) {

    if(str.length < 0 || str.length === undefined)
    {
        return true;
    }
    else
    {
        return false;
    }
}

const getExpense = async (req,res,next) => {

    try {

        const response = await Expense.findAll({where : {userId : req.user.id}})
        res.status(200).json(response);
    }
    catch(err) {
        res.status(400).json(err);
    }
}

const addExpense = async (req,res,next) => {

    // const amount = req.body.amount ;
    // const description = req.body.description ;
    // const category = req.body.category ;

    // const t = await sequelize.transaction();

    try {

    const t = await sequelize.transaction();
    const amount = req.body.amount ;
    const description = req.body.description ;
    const category = req.body.category ;

        if(isValid(amount) || isValid(description) || isValid(category))
        {
           return res.status(400).json({err : 'please enter valid parameters'});
        }

        const expense = await Expense.create({

            amount : amount ,
            description : description ,
            category : category,
            userId : req.user.id
        },{transaction : t})

           const user = await User.update({
                totalExpenses : Number(req.user.totalExpenses) + Number(amount)
            },{where :{id : req.user.id},transaction : t})

            Promise.all([expense,user])
            .then(async() => {
                await t.commit();
                return res.status(200).json(expense);
            })
            .catch(async(err) => {
                await t.rollback();
                return res.status(500).json({message : "something went wrong",success : "failure",err})
            })
        }
        catch(err) {
            return res.status(500).json({message : "something went wrong",success : "failure",err});
        }

}

const deleteExpense = async ( req,res,next) => {

    const id = req.params.id ;
    const t = await sequelize.transaction();

    try{

       const deleteUser = await Expense.findOne({where : {id : id,userId : req.user.id}},{transaction : t})

       console.log('deleteUser',deleteUser)

       const  updateUser = await User.update({

        totalExpenses : Number(req.user.totalExpenses) - Number(deleteUser.amount)},{where :{id : req.user.id}
       },{transaction : t})

       Promise.all([deleteUser,updateUser])
       .then(async()=> {
        t.commit();
        await Expense.destroy({where : {id : id , userId : req.user.id}})
        return  res.status(200).json({message : "successfully deleted expenses"})
      }) 
       .catch((err) => {
        t.rollback();
        return res.status(401).json({success : false , message : "expenses doesn't exists"});
       })
    }
    catch(err) {
        t.rollback();
        res.status(400).json(err);
    }
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
}