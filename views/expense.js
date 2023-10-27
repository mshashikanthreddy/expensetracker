async function showExpenditure(event)
{
    event.preventDefault();
    const amount =  event.target.price.value;
    const description =  event.target.description.value; 
    const category =  event.target.category.value;

    const expense = {
        amount,
        description,
        category
    }

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/expense/addExpense',expense,{headers : {'Authorization' : token}});
            showItemsOnScreen(response.data);
        }
    
    catch(err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded' , async() => {

    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/expense/getExpense',{headers : {'Authorization' : token}})
        response.data.forEach((element) => {
            showItemsOnScreen(element);
        })
    }
    catch(err) {
        console.log(err);
    }
})

function showItemsOnScreen(list){

    document.getElementById('price').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';

    const parentElement = document.getElementById('listOfExpenditures');

    const childElement = `<li id=${list.id}> '${list.amount}'-'${list.description}'-'${list.category}'
                        <button class="deletebutton" onclick=deleteUser(${list.id})>Delete</button>
                        </li>`

    parentElement.innerHTML += childElement;

}

     async function deleteUser(id) {
        try {
            const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:3000/expense/deleteExpense/${id}`,{headers : {'Authorization' : token}})
        
            removeOnScreen(id);
        }
        catch(err) {
            console.log(JSON.stringify(err));
        }
    }

    function removeOnScreen(id) {

        const parentElement = document.getElementById('listOfExpenditures');

        const childElement = document.getElementById(id);

        parentElement.removeChild(childElement);
    }

document.getElementById('rzp-button1').onclick = async function (e) {

    const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:3000/purchase/premiumUser",{headers : {"Authorization" : token}});

    var options = 
    {
        "key" : response.data.key_id , 
        "order_id" : response.data.order.id,
        // Both the key and orderid are sent to razorpay for payment process to continue
        // orderid is only for one time payment

        "handler" : async function ( response) { // "handler" is a callback function which will handle the success payment

         const user =  await axios.post("http://localhost:3000/purchase/updateTransactionStatus",{

            order_id : options.order_id,
            payment_id : response.razorpay_payment_id
            },
            {headers : {"Authorization" : token}});
            
            alert('congratulations, you are premium user now');

            document.getElementById('rzp-button1').style.visibility = "hidden";
            localStorage.setItem('token',user.data.token);

        },
    };

    const rzp1 = new Razorpay(options); // which opens the razorpay page
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function(response) {
        alert('Transaction failed,something went wrong');
    })
}