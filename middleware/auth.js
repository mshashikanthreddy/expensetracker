const jwt = require('jsonwebtoken');

const User = require('../models/userlogin');

const verification = async (req,res,next) => {

    try{

        const token = req.header('Authorization');
        const user = jwt.verify(token , 'secretkey');

        console.log('user',user);
         User.findByPk(user.userId)
         .then(response => {
            console.log("result",response);
            req.user = response; // req is common for the verification and getExpenses so, we are passing the req.user to the next middleware.
            next();
         })
         .catch(err => {
            return res.status(401).json({err : "authentication error",err})
         })

    
    }
    catch(err) {
        
        return res.status(400).json({success : false,message : "Something Went Wrong"})
    }
}

module.exports = {

    verification
}