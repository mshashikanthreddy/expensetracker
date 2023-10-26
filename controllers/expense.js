const Expense = require('../models/expenses');


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

    const amount = req.body.amount ;
    const description = req.body.description ;
    const category = req.body.category ;

    try {

        if(isValid(amount) || isValid(description) || isValid(category))
        {
           return res.status(400).json({err : 'please enter valid parameters'});
        }

        const response = await Expense.create({

            amount : amount ,
            description : description ,
            category : category,
            userId : req.user.id
        })
        res.status(200).json(response);
    }
    catch(err) {
        res.status(400).json(err);
    }

}

const deleteExpense = async ( req,res,next) => {

    const id = req.params.id ;

    try{

      const response =  await Expense.destroy({where : {id : id , userId : req.user.id}})

      

       if(response == 0)
       {
        return res.status(401).json({success : false , message : "expenses doesn't exists"});
       }
       res.status(200).json({message : "successfully deleted expenses"})


    }
    catch(err) {
        res.status(400).json(err);
    }
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
}