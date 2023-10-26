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
        try{
             const response = await axios.post("http://localhost:3000/user/signUp",user) 
  
                 alert(response.data.message);  
                 window.location.href = "../views/user.html";
            }
        catch(err){
            alert(err.message);
        }
}