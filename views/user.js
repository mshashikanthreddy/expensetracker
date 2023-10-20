async function registerUser(event) {

    event.preventDefault();

    const Name = event.target.username.value ;
    const Email = event.target.email.value ;
    const Password = event.target.password.value ;

    const user = {

        Name ,
        Email ,
        Password
    }

    try{
        const response = await axios.POST("http://localhost:3000/user/signUp",user)  
        console.log(response);    
    }
    catch(err){
        console.log(err);
    }
}