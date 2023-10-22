const User = require('../models/userlogin');

exports.checkUserDetails = async (req,res,next) => {

    try{

    const email = req.body.email;
    const password = req.body.password;

    const response =  await User.findAll()
     

    

    let flag = true;

    for(let i=0;i<response.length;i++)
    {

        if(response[i].email == email && response[i].password == password)
        {
            flag = false;
            return res.status(200).json({message : "successfully loggged in"});      
        }
        else if(response[i].email == email && response[i].password != password)
        {
            flag = false;
            return res.status(404).json({message : "password is incorrect"});  
        }
        else if(response[i].email != email && response[i].password == password)
        {
            flag  = false;
            return res.status(404).json({message : "email is incorrect"});
        }
    }

    if(flag)
    {
        res.status(404).json({message : "User Not Found"});  
    }

    

    }
    catch(err) {
        console.log(err);
    }

}

function stringInvalid(string)
{
    if(string.length < 0 || string === undefined)
    {
        return true;
    }
    else
    {
        return false;
    }
}

exports.postUserDetails = async (req,res,next) => {

    const name = req.body.name ;
    const email = req.body.email;
    const password = req.body.password;

    try {

    if(stringInvalid(name) || stringInvalid(email) || stringInvalid(password))
    {
        res.status(400).json( {err : "Bad Parameters , Something is missing"});
    }

     const response  = await User.findAll()
     

    console.log(response.length);

    
     for(let i=0;i<response.length;i++)
     {
        if(response[i].name == name && response[i].email != email)
        {
            res.status(404).json( {err : "User Credentials Already Exists"});
        }
     }
    

        User.create({
            name : name ,
            email : email,
            password : password
        })
        .then(response => {
            res.status(200).json(response);
        })
    }
    catch(err) {
        console.log(err);
    }
}
