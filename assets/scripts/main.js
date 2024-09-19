document.addEventListener("DOMContentLoaded", () => {
    const currentBalanceEl = document.getElementById("currentBalance");
    let currentBalance = 0;
    let stock = {};
    let dailyProfits = []; // Array to store daily profits
    let dailyExpenses = []; // Array to store daily expenses

    // Event Listeners for forms
    document.getElementById('stockForm').addEventListener('submit', addOrUpdateStock);
    document.getElementById('salesForm').addEventListener('submit', recordSale);
    document.getElementById('expenseForm').addEventListener('submit', recordExpense);

    // Add Balance
    function addBalance() {
        const amount = prompt("Enter amount to add:");
        currentBalance += parseFloat(amount);
        updateBalance();
    }

    // Add or Update Stock (including profit percentage)
    function addOrUpdateStock(e) {
        e.preventDefault();
        const itemName = document.getElementById("itemName").value;
        const itemQuantity = parseInt(document.getElementById("itemQuantity").value);
        const itemPrice = parseFloat(document.getElementById("itemPrice").value);
        const profitPercent = parseFloat(prompt("Enter profit percentage on this item:", 0)); // Prompt for profit percentage

        if (stock[itemName]) {
            stock[itemName].quantity += itemQuantity;
        } else {
            stock[itemName] = { quantity: itemQuantity, price: itemPrice, profitPercent: profitPercent };
        }

        currentBalance -= itemPrice * itemQuantity;
        updateBalance();
        displayStock();
    }

    // Record Sale (with profit calculation)
    function recordSale(e) {
        e.preventDefault();
        const salesItem = document.getElementById("salesItem").value;
        const salesQuantity = parseInt(document.getElementById("salesQuantity").value);

        if (stock[salesItem] && stock[salesItem].quantity >= salesQuantity) {
            stock[salesItem].quantity -= salesQuantity;

            // Calculate profit: price * quantity * (profitPercent / 100)
            const itemProfit = stock[salesItem].price * salesQuantity * (stock[salesItem].profitPercent / 100);

            // Add sale price and profit to balance
            const saleTotal = stock[salesItem].price * salesQuantity + itemProfit;
            currentBalance += saleTotal;

            dailyProfits.push(itemProfit); // Store profit for the day
            updateBalance();
            displayStock();
            displaySales(salesItem, salesQuantity, itemProfit); // Record sale in table
            drawProfitGraph(); // Redraw the graph

            alert(`Sold ${salesQuantity} of ${salesItem}. Profit: $${itemProfit.toFixed(2)}`);
        } else {
            alert("Insufficient stock!");
        }
    }

    // Record Expense
    function recordExpense(e) {
        e.preventDefault();
        const expenseDesc = document.getElementById("expenseDesc").value;
        const expenseAmount = parseFloat(document.getElementById("expenseAmount").value);

        currentBalance -= expenseAmount;
        dailyExpenses.push(expenseAmount); // Store expense for the day
        updateBalance();
        displayExpenses(expenseDesc, expenseAmount); // Record expense in table
        drawExpenseGraph(); // Redraw the expense graph
    }

    // Update Balance Display
    function updateBalance() {
        currentBalanceEl.textContent = currentBalance.toFixed(2);
    }

    // Display Stock List
    function displayStock() {
        const stockListEl = document.getElementById("stockList");
        stockListEl.innerHTML = '';

        for (let item in stock) {
            stockListEl.innerHTML += `<p>${item}: ${stock[item].quantity} units @ $${stock[item].price} each, Profit: ${stock[item].profitPercent}%</p>`;
        }
    }

    // Display Sales in Table
    function displaySales(item, quantity, profit) {
        const salesTable = document.getElementById("salesTable");
        const row = salesTable.insertRow();
        row.innerHTML = `<td>${item}</td><td>${quantity}</td><td>$${profit.toFixed(2)}</td>`;
    }

    // Display Expenses in Table
    function displayExpenses(description, amount) {
        const expensesTable = document.getElementById("expensesTable");
        const row = expensesTable.insertRow();
        row.innerHTML = `<td>${description}</td><td>$${amount.toFixed(2)}</td>`;
    }

    // Profit Visualization (using Chart.js)
    function drawProfitGraph() {
        const ctx = document.getElementById('profitGraph').getContext('2d');

        // Clear existing graph if it exists
        if (window.profitChart) {
            window.profitChart.destroy();
        }

        // Create the chart
        window.profitChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: dailyProfits.length }, (_, i) => `Day ${i + 1}`), // Dynamic labels
                datasets: [{
                    label: 'Daily Profit',
                    data: dailyProfits,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Expense Visualization (using Chart.js)
    function drawExpenseGraph() {
        const ctx = document.getElementById('expenseGraph').getContext('2d');

        // Clear existing graph if it exists
        if (window.expenseChart) {
            window.expenseChart.destroy();
        }

        // Create the chart
        window.expenseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: dailyExpenses.length }, (_, i) => `Day ${i + 1}`), // Dynamic labels
                datasets: [{
                    label: 'Daily Expense',
                    data: dailyExpenses,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    drawProfitGraph(); // Initial call to draw an empty profit graph
    drawExpenseGraph(); // Initial call to draw an empty expense graph
});
