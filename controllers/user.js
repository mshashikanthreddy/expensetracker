const User = require('../models/userlogin');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

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

const signUp = async (req,res,next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {

        

        if(isValid(name) || isValid(email) || isValid(password))
        {
           return res.status(400).json({err : 'please enter valid parameters'});
        }

        const response = await User.findAll( {where : {email : email}});

        if(response.length > 0)
        {
             return res.status(401).json({err : 'Email already exists'});
        }

        const saltrounds = 10 ;
            bcrypt.hash ( password , saltrounds , async (err , hash) => {
               console.log(err)
            await User.create({name : name , email : email , password : hash})
            res.status(201).json({message : 'New user created successfully'});
        })
    }catch(err) {
        res.status(400).json(err);
    }

}

const generateToken = (id)=> 
{  

    return jwt.sign({userId  : id}, 'secretkey');
}

const login = async (req,res,next) => {

    const email = req.body.email ;
    const password = req.body.password;

    try{

        const response = await User.findAll({where : {email : email}})

        if(response.length > 0)
        {
            bcrypt.compare(password,response[0].password, (err , result) => {

                if(err)
                {
                    console.log(err);
                }
                else if(result === true) 
                {
                    
                    return res.status(200).json({message : 'successfully logged in' , success : true, token : generateToken(response[0].id)});
                }
                else
                {
                    res.status(400).json({message : 'password is incorrect'});
                }
            })
        }
            else
            {
                res.status(404).json({err : "User doesn't exists"})
            }
    }
    catch(err) {
        res.status(500).json(err);
    }
}

module.exports = {

    signUp,
    login,
    generateToken
}


     