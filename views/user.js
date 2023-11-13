async function loginUser(event){

    event.preventDefault();

    const email = event.target.mail.value;
    const password = event.target.password.value;

    const user = {

        email,
        password
    }

    try{

        const response = await axios.post("http://52.90.117.238:3000/user/login",user)

        document.getElementById('mail').value = "";

        localStorage.setItem('token',response.data.token);

        //console.log(response.data.token);
        
        alert(response.data.message);

        if(response.status === 200)
        {
            document.getElementById('mail').value = '';
            document.getElementById('password').value = '';
            window.location.href = "../views/expense.html" ;
        }
        
    }
    catch(err) {
        console.log(err.response.data);
        alert(err.response.data.message) // to error out message.
    }
}