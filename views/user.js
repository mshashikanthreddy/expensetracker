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

        alert(response.data.message);

    }
    catch(err) {
        alert(err.message);
    }
}