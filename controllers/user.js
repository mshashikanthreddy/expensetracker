const User = require('../models/userlogin');

exports.getUserDetails = async (req,res,next) => {

    try{

    await User.findAll()
    .then(response => {
        res.json(response)
    })
    }
    catch(err) {
        console.log(err);
    }

}

exports.postUserDetails = async (req,res,next) => {

    const name = req.body.name ;
    const email = req.body.email;
    const password = req.body.password;
    try{

        User.create({
            name : name ,
            email : email,
            password : password
        })
        .then(response => {
            res.json(response)
        })
    }
    catch(err) {
        console.log(err);
    }
}