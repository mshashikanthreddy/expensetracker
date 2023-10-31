const Sib = require('sib-api-v3-sdk');
const dotenv = require('dotenv').config();

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY

const passwordRequest = async (req,res) => {

const transEmailApi = new Sib.TransactionalEmailsApi()
//Transactional Email is used to send confirmation emails and for password reset etc;

const sender = {
    email : "shashikanthreddymulinti@gmail.com"
}

const receivers = [
    {
        email : req.body.email 
    }
]
try {
await transEmailApi.sendTransacEmail({
    sender,
    to : receivers,
    subject : "password reset link",
    textContent : "By clicking on the link you can set your new password"
})

    return res.status(200).json({message : "password reset link sent to your mail"})
}

catch(err) {
    console.log(err);
    res.status(400).json({message :"something went wrong",err:err})
    
}

}

module.exports = {
    passwordRequest
}