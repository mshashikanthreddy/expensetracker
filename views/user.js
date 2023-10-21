async function registerUser(event) {

    event.preventDefault();

    const name = event.target.username.value ;
    const email = event.target.email.value ;
    const password = event.target.password.value ;

    const user = {

        name ,
        email ,
        password
    }

    try {

        const response = await axios.get("http://localhost:3000/user/check-user")

       for(let i=0;i<response.data.length;i++)
       {

        
        if(response.data[i].name == user.name || response.data[i].email == user.email)
        {
            alert('User already Exist');
            return;
        }
        }

        try{
             const response = await axios.post("http://localhost:3000/user/signUp",user)  
                 console.log(response);    
            }
        catch(err){
            console.log(err);
        }
    }
    catch(err){
        console.log(err);
    }
    
   
}