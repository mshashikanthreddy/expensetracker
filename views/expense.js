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