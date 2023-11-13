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
             const response = await axios.post("http://52.90.117.238:3000/user/signUp",user) 
  
                 alert(response.data.message);
                 document.getElementById('username').value = '';
                 document.getElementById('email').value = '';  
                 document.getElementById('password').value = '';  
                 window.location.href = "../views/user.html";
            }
        catch(err){
            alert(err.response.data.message);
        }
}

