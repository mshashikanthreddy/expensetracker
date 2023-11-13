
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
        const response = await axios.post('http://52.90.117.238:3000/expense/addExpense',expense,{headers : {'Authorization' : token}});
            showItemsOnScreen(response.data);
        }
    
    catch(err) {
        console.log(err);
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('premium').innerHTML = "You are a premium user "
}

const paginationBtn = document.querySelector('#paginationbutton');
window.addEventListener('DOMContentLoaded' , async() => {

    
    try {
        const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const premiumUser = decodeToken.premiumUser
    if(premiumUser){
        showPremiumuserMessage()
        showLeaderBoard()
    }

    console.log(document.getElementById('pagenumber').value );
        const response = await axios.get(`http://52.90.117.238:3000/expense/getExpense?page=1`,{headers : {'Authorization' : token,'ITEMS_PER_PAGE ': document.getElementById('pagenumber').value }})

        let expenses = response.data.expenses;
        expenses.forEach((expense) => {
            showItemsOnScreen(expense);
        })
        showPagination(response.data);
    }
    catch(err) {
        console.log(err);
    }
})

function showPagination(pageDetails){
try {
   const currentPage = pageDetails.currentPage;
   const hasNextPage = pageDetails.hasNextPage;
   const nextPage    = pageDetails.nextPage;
   const hasPreviousPage = pageDetails.hasPreviousPage;
   const previousPage = pageDetails.previousPage;
  // const lastPage = pageDetails.

  // const paginationBtn = document.querySelector('#paginationbutton');

   paginationBtn.innerHTML = '';

   if(hasPreviousPage){
    const btn2 = document.createElement('button');
    btn2.innerHTML = previousPage
    btn2.addEventListener('click',() =>fetchExpenses(previousPage))
    paginationBtn.appendChild(btn2)
   }

   const btn1 = document.createElement('button');
   btn1.classList.add('active')
    btn1.innerHTML = currentPage
    btn1.addEventListener('click',() =>  fetchExpenses(currentPage))
    paginationBtn.appendChild(btn1)

   if(hasNextPage) {
    const btn2 = document.createElement('button');
    btn2.innerHTML = nextPage
    btn2.addEventListener('click',() =>  fetchExpenses(nextPage))
    paginationBtn.appendChild(btn2)
   }
}
catch(err){
    console.log(err);
}

}

async function fetchExpenses(page) {

    try{
        const token = localStorage.getItem('token');

    const response = await axios.get(`http://52.90.117.238:3000/expense/getExpense?page=${page}`,{headers : {'Authorization' : token,'ITEMS_PER_PAGE ': document.getElementById('pagenumber').value }})
    let expenses = response.data.expenses;
    document.getElementById('tablebody').innerHTML = '';
    expenses.forEach((expense) => {
        showItemsOnScreen(expense);
    })
    showPagination(response.data);
}
catch(err) {
    console.log(err);
}
}


function showItemsOnScreen(expense){

    document.getElementById('price').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';

    const tableBody = document.getElementById('tablebody');

    const date = new Date(expense.createdAt);
          const formattedDate = `${date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })} ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
          const row = document.createElement('tr');
          row.id = expense.id;
          row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${expense.amount}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>
              <button onclick="deleteUser(${expense.id})" class="btn btn-danger">Delete</button>
            </td>
          `
          tableBody.appendChild(row);
        }

// function showItemsOnScreen(expenses) {
//     console.log(expenses); // Log the value of expenses to check if it's an array
//     const tableBody = document.querySelector('#listOfExpenditures tbody');
//     tableBody.innerHTML = '';
  
//     let currentPage = 1;
// const expensesPerPage = 5;
//     // Calculate the start and end index for the current page
//     const startIndex = (currentPage - 1) * expensesPerPage;
//     const endIndex = startIndex + expensesPerPage;
  
//     // Slice the expenses array based on the start and end index
//     const paginatedExpenses = expenses.slice(startIndex, endIndex);
  
//     // Check if expenses is an array
//     paginatedExpenses.forEach((expense) => {
//       // Changing createdAt to a suitable date format
//       const date = new Date(expense.createdAt);
//       const formattedDate = `${date.toLocaleDateString('en-US', {
//         day: '2-digit',
//         month: '2-digit',
//         year: '2-digit',
//       })} ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${formattedDate}</td>
//         <td>${expense.amount}</td>
//         <td>${expense.description}</td>
//         <td>${expense.category}</td>
//         <td>
//           <button onclick="deleteExpense(${expense.id})">Delete</button>
//         </td>
//       `;
//       tableBody.appendChild(row);
//     });
  
//     // Create or update the pagination container
//     const paginationContainer = document.querySelector('#paginationbutton');
//     paginationContainer.innerHTML = '';
  
//     // Calculate the total number of pages
//     const totalPages = Math.ceil(expenses.length / expensesPerPage);
  
//     // Create pagination buttons
//     for (let i = 1; i <= totalPages; i++) {
//       const button = document.createElement('button');
//       button.innerText = i;
//       button.addEventListener('click', () => {
//         // Update current page and re-render expenses
//         currentPage = i;
//         showItemsOnScreen(expenses);
//       });
//       paginationContainer.appendChild(button);
//     }
//   }
  

     async function deleteUser(id) {
        try {
            const token = localStorage.getItem('token');
          await axios.delete(`http://52.90.117.238:3000/expense/deleteExpense/${id}`,{headers : {'Authorization' : token}})
        
            removeOnScreen(id);
        }
        catch(err) {
            console.log(JSON.stringify(err));
        }
    }

    function removeOnScreen(id) {

        const parentElement = document.getElementById('tablebody');

        const childElement = document.getElementById(id);

        parentElement.removeChild(childElement);
    }

    async function showLeaderBoard() {

        const inputElement = document.createElement('input');
        inputElement.type = "button";
        inputElement.value = "Display Leaderboard";
        inputElement.onclick = async() => {

            const token = localStorage.getItem('token');
            const leaderBoardList = await axios.get("http://52.90.117.238:3000/premium/leaderBoard", {headers : {"Authorization" : token}});

            var leaderBoardElement = document.getElementById('leaderboard');
            leaderBoardElement.innerHTML += `<h2> Leader Board </h2>`;


            leaderBoardList.data.forEach((userDetails) => {
                leaderBoardElement.innerHTML += `<li><i><b>Name - ${userDetails.name} ,Total Expense - ${userDetails.totalExpenses || 0}<i><b></li>`
            })    
        }
        document.getElementById('premium').appendChild(inputElement);
    }

   async function download() {

            try {
            const token = localStorage.getItem('token');
         const response = await axios.get('http://52.90.117.238:3000/expense/download', { headers: { Authorization: token } })
            
         if(response.status === 200 )
         {
            let a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
         }
         else{
            throw new Error(response.data.message);
         }
    }
    catch(err) {
        console.log(err);
        throw new Error(err);
    }
}
    


document.getElementById('rzp-button1').onclick = async function (e) {

    const token = localStorage.getItem('token');
    const response = await axios.get("http://52.90.117.238:3000/purchase/premiumUser",{headers : {"Authorization" : token}});

    var options = 
    {
        "key" : response.data.key_id , 
        "order_id" : response.data.order.id,
        // Both the key and orderid are sent to razorpay for payment process to continue
        // orderid is only for one time payment

        "handler" : async function ( response) { // "handler" is a callback function which will handle the success payment

         const user =  await axios.post("http://52.90.117.238:3000/purchase/updateTransactionStatus",{

            order_id : options.order_id,
            payment_id : response.razorpay_payment_id
            },
            {headers : {"Authorization" : token}});
            
            alert('congratulations, you are premium user now');

            document.getElementById('rzp-button1').style.visibility = "hidden";

            const parentElement = document.getElementById('premium') ;
            const childElement = `<li>you are premium user now</li>`;
            parentElement.innerHTML += childElement;
            localStorage.setItem('token',user.data.token);

            showLeaderBoard ();

        },
    };

    const rzp1 = new Razorpay(options); // which opens the razorpay page
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function(response) {
        console.log()
        alert('Transaction failed,something went wrong');
    })
}

