async function sendEmail(event) {

    event.preventDefault();

    const email = event.target.email.value ;

    const obj = {
        email
    }

    try {

        const response = await axios.post("http://54.87.54.201:3000/password/forgotpassword",obj)

        console.log(response.data.message);

        alert(response.data.message);
    }
    catch(err){
        console.log(err);
    }
}