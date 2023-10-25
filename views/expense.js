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
        const response = await axios.post('http://localhost:3000/expense/addExpense',expense);
            showItemsOnScreen(response.data);
        }
    
    catch(err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded' , async() => {

    try {
        const response = await axios.get('http://localhost:3000/expense/getExpense')
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
          await axios.delete(`http://localhost:3000/expense/deleteExpense/${id}`)
        
            removeOnScreen(id);
        }
        catch(err) {
            console.log(err);
        }
    }

    function removeOnScreen(id) {

        const parentElement = document.getElementById('listOfExpenditures');

        const childElement = document.getElementById(id);

        parentElement.removeChild(childElement);
    }