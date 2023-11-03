const Expense = require('../models/expenses');

const User = require('../models/userlogin');

const sequelize = require('../util/database');

const AWS = require('aws-sdk');


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

const getExpense =  (req,res,next) => {

  const page = Number(req.query.page || 1);
  const ITEMS_PER_PAGE =Number( req.header('ITEMS_PER_PAGE') || 5 );
  console.log(ITEMS_PER_PAGE);
  console.log(req.query.page);
  let totalItems;
    try {

      Expense.count()
      .then((total) => {
      totalItems = total;
      console.log(totalItems)
        return Expense.findAll(
          {offset : (page - 1) * ITEMS_PER_PAGE,
          limit : ITEMS_PER_PAGE},
         {where : {userId : req.user.id}})
        })
         .then((expense) => {

          res.status(200).json({
            expenses : expense,
            currentPage : page,
            hasNextPage : ITEMS_PER_PAGE * page < totalItems,
            nextPage : page + 1,
            hasPreviousPage : page > 1,
            previousPage : page - 1,
            lastPage : Math.ceil(totalItems / ITEMS_PER_PAGE),
          })
        })
          .catch((err) => {
            console.log(err);
          })
    }
    catch(err) {
        res.status(400).json(err);
    }
}

function uploadToS3(data, filename) {
    const BUCKET_NAME = 'expensetracker-1';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
    const s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET
    });
  
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: 'public-read'
    };
  
    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log('Something went wrong', err);
          reject(err);
        } else {
          console.log('Upload success', s3response);
          resolve(s3response.Location);
        }
      });
    })
}

const downloadExpenses = async (req, res) => {
    try {
      const expenses = await Expense.findAll({ where: { userId: req.user.id } });
      console.log(expenses);
      const stringifiedExpenses = JSON.stringify(expenses);
      const userName =req.user.name;
     
      const filename = `Expense${userName}/${new Date()}.txt`;
  
      const fileURL = await uploadToS3(stringifiedExpenses, filename);
      console.log(fileURL);
      res.status(200).json({ fileURL, success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err, success: false });
    }
  };
  

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
    deleteExpense,
    downloadExpenses
}