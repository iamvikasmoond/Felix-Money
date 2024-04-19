document.addEventListener('DOMContentLoaded', function() {
    const transactionForm = document.getElementById('transaction-form');
    const transactionNameInput = document.getElementById('transaction-name');
    const transactionAmountInput = document.getElementById('transaction-amount');
    const transactionList = document.getElementById('transaction-list');
    const incomeBtn = document.getElementById('income-btn');
    const expenseBtn = document.getElementById('expense-btn');
    const totalEarnedDisplay = document.getElementById('total-earned');
    const totalSpentDisplay = document.getElementById('total-spent');
    const availableBalanceDisplay = document.getElementById('available-balance');
    const chartCtx = document.getElementById('myChart').getContext('2d');

    // Check if there are any existing transactions in local storage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let totalEarned = 0;
    let totalSpent = 0;

    // Function to calculate total earned and total spent
    function calculateTotals() {
        totalEarned = transactions.filter(transaction => transaction.amount > 0)
                                  .reduce((acc, curr) => acc + curr.amount, 0);
        totalSpent = transactions.filter(transaction => transaction.amount < 0)
                                 .reduce((acc, curr) => acc + curr.amount, 0) * -1;
        totalEarnedDisplay.textContent = `₹${totalEarned}`;
        totalSpentDisplay.textContent = `₹${totalSpent}`;
        availableBalanceDisplay.textContent = `₹${totalEarned - totalSpent}`;
    }

    // Function to render transactions
    function renderTransactions() {
        transactionList.innerHTML = '';
        transactions.forEach(function(transaction, index) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${transaction.name}</td>
                <td style="color: ${transaction.amount >= 0 ? '#90D26D' : '#FF6464'}">${transaction.amount}</td>
                <td>${transaction.date}</td>
                <td>
                    <button class="modify-btn" data-index="${index}">Modify</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            transactionList.appendChild(newRow);
        });
        calculateTotals();
    }

    // Render existing transactions when the page loads
    renderTransactions();

    // Add transaction
    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const transactionName = transactionNameInput.value.trim();
        let transactionAmount = parseFloat(transactionAmountInput.value);
        const date = new Date().toLocaleString();

        if (transactionName === '' || isNaN(transactionAmount)) {
            alert('Please enter valid transaction details.');
            return;
        }

        // Determine the button clicked and adjust transaction amount accordingly
        if (event.submitter === incomeBtn) {
            transactionAmount = Math.abs(transactionAmount); // Ensure income is positive
        } else if (event.submitter === expenseBtn) {
            transactionAmount = -Math.abs(transactionAmount); // Ensure expense is negative
        }

        // Add the new transaction to the array
        transactions.push({
            name: transactionName,
            amount: transactionAmount,
            date: date
        });

        // Save the updated transactions to local storage
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // Render the updated list of transactions
        renderTransactions();

        // Clear input fields
        transactionNameInput.value = '';
        transactionAmountInput.value = '';
    });

    // Modify transaction
    transactionList.addEventListener('click', function(event) {
        if (event.target.classList.contains('modify-btn')) {
            const index = event.target.dataset.index;
            const transaction = transactions[index];
            const newTransactionName = prompt('Enter new transaction name:', transaction.name);
            const newTransactionAmount = parseFloat(prompt('Enter new amount:', transaction.amount));

            if (newTransactionName !== null && !isNaN(newTransactionAmount)) {
                // Update the transaction details
                transactions[index].name = newTransactionName;
                transactions[index].amount = newTransactionAmount;
                transactions[index].date = new Date().toLocaleString();

                // Save the updated transactions to local storage
                localStorage.setItem('transactions', JSON.stringify(transactions));

                // Render the updated list of transactions
                renderTransactions();
            }
        }
    });

    // Delete transaction
    transactionList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const index = event.target.dataset.index;
            // Remove the transaction from the array
            transactions.splice(index, 1);
            // Save the updated transactions to local storage
            localStorage.setItem('transactions', JSON.stringify(transactions));
            // Render the updated list of transactions
            renderTransactions();
        }
    });

    // Chart.js
    const myChart = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: transactions.map(transaction => transaction.date),
            datasets: [{
                label: 'Total Money (₹)',
                data: transactions.map(transaction => transaction.amount),
                borderColor: '#90D26D',
                backgroundColor: '#90D26D',
                fill: false
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Money (₹)'
                    }
                }]
            }
        }
    });
});

// Get references to the menu items
const menuItems = document.querySelectorAll('.menu a');

// Get references to the content sections
const sections = {
    'home': document.getElementById('transaction-details'),
    'budget': document.getElementById('budget-details'),
    'insights': document.getElementById('insights-details'),
    'account': document.getElementById('account-details')
};

// Hide all content sections except 'home' by default
Object.values(sections).forEach(section => {
    if (section.id !== 'transaction-details') {
        section.style.display = 'none';
    }
});

// Add click event listeners to menu items
menuItems.forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const id = this.getAttribute('id');
        // Show the corresponding section, hide others
        if (sections[id]) {
            showSection(sections[id]);
        }
    });
});

function showSection(section) {
    // Hide all sections
    Object.values(sections).forEach(sec => {
        sec.style.display = 'none';
    });
    // Show the specified section
    section.style.display = 'block';
}
