document.addEventListener('DOMContentLoaded', function() {
    const transactionForm = document.getElementById('transaction-form');
    const transactionNameInput = document.getElementById('transaction-name');
    const transactionAmountInput = document.getElementById('transaction-amount');
    const transactionList = document.getElementById('transaction-list');
    const chartCanvas = document.getElementById('myChart');
    const totalEarnedDisplay = document.querySelector('.total-earned');
    const totalSpentDisplay = document.querySelector('.total-spent');
    const availableBalanceDisplay = document.querySelector('.available-balance');

    // Check if there are any existing transactions in local storage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Function to render transactions
    function renderTransactions() {
        transactionList.innerHTML = '';
        let totalEarned = 0;
        let totalSpent = 0;

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

            if (transaction.amount >= 0) {
                totalEarned += transaction.amount;
            } else {
                totalSpent += Math.abs(transaction.amount);
            }
        });

        totalEarnedDisplay.textContent = `₹${totalEarned}`;
        totalSpentDisplay.textContent = `₹${totalSpent}`;
        availableBalanceDisplay.textContent = `₹${totalEarned - totalSpent}`;

        // Update chart
        updateChart();
    }

    // Function to update the chart
    function updateChart() {
        const labels = [];
        const data = [];
        let currentBalance = 0;

        transactions.forEach(transaction => {
            labels.push(transaction.date);
            currentBalance += transaction.amount;
            data.push(currentBalance);
        });

        // Chart.js data
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Balance (₹)',
                data: data,
                borderColor: '#4D7EA8', // Blue color for line
                backgroundColor: 'transparent',
                fill: false,
            }],
        };

        // Chart.js options
        const options = {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day', // Set the time unit for X-Axis
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Time',
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Money (₹)',
                    },
                }],
            },
        };

        // Create Chart.js instance
        const myChart = new Chart(chartCanvas, {
            type: 'line',
            data: chartData,
            options: options,
        });
    }

    // Add transaction
    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const transactionName = transactionNameInput.value.trim();
        let transactionAmount = parseFloat(transactionAmountInput.value);
        const date = new Date().toISOString(); // Use ISO format for better time handling

        if (transactionName === '' || isNaN(transactionAmount)) {
            alert('Please enter valid transaction details.');
            return;
        }

        // Add the new transaction to the array
        transactions.push({
            name: transactionName,
            amount: transactionAmount,
            date: date,
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
                transactions[index].date = new Date().toISOString(); // Update date to current time

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

    // Initial rendering of transactions and chart
    renderTransactions();
});
