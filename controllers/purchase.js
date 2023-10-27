const Razorpay = require('razorpay');

const Order = require('../models/orders');

const userController = require('./user'); // import from user controller 

const purchasePremium = async  (req,res) => {

    try{

        var rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRET
        })

        console.log(process.env.RAZORPAY_KEY_SECRET);
        const amount = 1000 ;

        // we are send the details and creating the order and in response it gives orderid if gets success
         rzp.orders.create({amount , currency : "INR" }, (err , order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid : order.id , status : 'PENDING'})
            .then(() => {
                return res.status(201).json({order , key_id : rzp.key_id});
                // the key_id is sent to frontend of the razorpay
            })
            .catch(err => {
                throw new Error(err)
            })
        })
    }
        catch(err) {
            console.log(JSON.stringify(err));
            res.status(401).json({message : "something went wrong",err : err});
        }
    }

const updateTransactionStatus = async (req,res,next) => {
    try{

        const userId = req.user.id;

        const payment_id = req.body.payment_id;
        const order_id = req.body.order_id;

        const order = await Order.findOne({where : {orderid : order_id}})

       console.log( order ) ;
            const promise1 = order.update({ paymentid : payment_id , status : "SUCCESSFUL"})
            const promise2 = req.user.update({ premiumUser : true})

            Promise.all([promise1,promise2]).then(() => {
                return res.status(200).json({success : true , message : "Transaction is Successful", token : userController.generateToken(userId)});
                // here token is generated to send to frontend and 
                //remove the "buy premium" button in the user dashboard.
            })
            .catch(err => {
                throw new Error (err);
            })
        }
        // else
        // {
        //      order.update({paymentid : payment_id , status : "FAILED"});
        //     return res.status(401).json({message : "Transaction Failed"});
        // }
    //}
    catch(err) {
        res.status(403).json({message : "something went wrong",err : err})
    }
}

module.exports = {

    purchasePremium,
    updateTransactionStatus
}
