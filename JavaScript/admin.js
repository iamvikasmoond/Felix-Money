// admin.js
// Get transaction list element 
const transactionList = document.getElementById("transaction-list"); 

// Function to render transactions in tabular form 
function renderTransactions() { 
    // Clear transaction list 
    transactionList.innerHTML = ""; 

    // Loop through transactions array and create table rows 
    for (let i = 0; i < transactions.length; i++) { 
        const transaction = transactions[i]; 
        const transactionRow = document.createElement("tr"); 
        transactionRow.innerHTML = ` 
            <td>${transaction.name}</td> 
            <td>₹${transaction.amount}</td> 
            <td>${new Date(transaction.timestamp).toLocaleString()}</td> 
            <td class="delete-btn" data-id="${transaction.id}">Delete</td> 
        `; 
        transactionList.appendChild(transactionRow);
    }
} 

// Function to delete transaction 
function deleteTransaction(event) { 
    if (event.target.classList.contains("delete-btn")) { 
        // Get transaction ID from data-id attribute 
        const transactionId = parseInt(event.target.getAttribute("data-id")); 

        // Find the index of transaction to delete
        const transactionIndex = transactions.findIndex(transaction => transaction.id === transactionId);
        if (transactionIndex !== -1) {
            // Remove transaction from transactions array
            transactions.splice(transactionIndex, 1);

            // Render updated transactions
            renderTransactions();
        }
    } 
} 

// Add event listener to delete transactions
transactionList.addEventListener("click", deleteTransaction);

// Render initial transactions on page load 
renderTransactions();
