const Sib = require('sib-api-v3-sdk');

const uuid = require('uuid');

const bcrypt = require('bcrypt');

const User = require('../models/userlogin')

const Forgotpassword = require('../models/forgotpassword');

const passwordRequest = async (req,res) => {
    const email = req.body.email;

    const user = await User.findOne({where : {email}})

    if(user){

        const id = uuid.v4();  // random uuid 

        Forgotpassword.create({id : id, isactive : true,userId:user.id})
        .catch((err) => {
            throw new Error(err);
        })
    
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.API_KEY

const transEmailApi = new Sib.TransactionalEmailsApi()
//Transactional Email is used to send confirmation emails and for password reset etc;

const sender = {
    email : "shashikanthreddymulinti@gmail.com"
}

const receivers = [
    {
        email : email
    }
]

transEmailApi.sendTransacEmail({
    sender,
    to : receivers,
    subject : "password reset link",
    htmlcontent:`<a href="http://52.90.117.238:3000/password/resetpassword/${id}">Reset password</a>` // we have to type "htmlcontent" not "html"

}).then(() => {
    return res.status(200).json({message : "password reset link sent to your mail",success:true});
})
.catch((err) => {
    return res.status(401).json({message : "something went wrong, couldn't send link ",success:false,err})
})
}

    else {
        throw new Error(err)
    }
}


const resetpassword = async (req,res) => {

    const id = req.params.id;

    try {

   const forgotpasswordrequest = await Forgotpassword.findOne({where : {id : id}})

   forgotpasswordrequest.update({isactive : false})
   .then(()=> {
    return res.status(200).send(
    `<html>
    <body>
    <form action="/password/updatepassword/${id}" method="get">
    <label>New Password</label>
    <input type="password" name="newpassword" id="newpassword">
    <button>update password</button>
    </form>
    </body>
    </html>`)
   })
   .catch((err) => {
    throw new Error(err);
   })   
}
catch(err) {
    res.status(401).json({message:"something went wrong",success : false})
}
}

const updatepassword = async(req,res) => {

    const newpassword = req.query.newpassword;
    const resetpasswordid = req.params.resetpasswordid;

    try{

    const updatepasswordrequest = await Forgotpassword.findOne({where : {id : resetpasswordid}})

    User.findOne({where : { id: updatepasswordrequest.userId}})
    .then((user) => {
        if(user) {

            const saltrounds = 10;
            bcrypt.genSalt(saltrounds,(err,salt) => {
                if(err) {
                    throw new Error(err);
                }
            bcrypt.hash(newpassword,salt,(err,hash) => {
                if(err) {
                    throw new Error(err);
                }
                user.update({password : hash})
                .then(()=> {
                    return res.status(200).json({message : "succesfully updated password",success: false});
                })
            })
            })
        }
        else{
            return res.status(400).json({message : "No user exists"})
        }
    })
}
catch(err){
    res.status(400).json(err);
}

}

module.exports = {
    passwordRequest,
    resetpassword,
    updatepassword
}