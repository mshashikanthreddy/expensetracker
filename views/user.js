async function loginUser(event){

    event.preventDefault();

    const email = event.target.mail.value;
    const password = event.target.password.value;

    const user = {

        email,
        password
    }

    try{

        const response = await axios.post("http://localhost:3000/user/login",user)

        document.getElementById('mail').value = "";

        localStorage.setItem('token',response.data.token);

        //console.log(response.data.token);
        
        alert(response.data.message);

        if(response.status === 200)
        {
            window.location.href = "../views/expense.html" ;
        }
        else
        {
            throw new Error('failed to load page');
        }
    }
    catch(err) {
        alert(err.message);
    }
}