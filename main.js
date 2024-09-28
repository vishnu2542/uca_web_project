document.addEventListener("DOMContentLoaded", () => {
    // variables initialization for features
    const currentBalanceEl = document.getElementById("currentBalance");
    let currentBalance = parseFloat(localStorage.getItem('currentBalance')) || 0;
    let stock = JSON.parse(localStorage.getItem('stock')) || {};
    let dailyProfits = JSON.parse(localStorage.getItem('dailyProfits')) || [];
    let dailyExpenses = JSON.parse(localStorage.getItem('dailyExpenses')) || [];

    updateBalance();
    displayStock();
    drawProfitGraph();
    drawExpenseGraph();

    // Event Listeners for forms
    document.getElementById('stockForm').addEventListener('submit', addOrUpdateStock);
    document.getElementById('salesForm').addEventListener('submit', recordSale);
    document.getElementById('expenseForm').addEventListener('submit', recordExpense);

    // Add Balance
    window.addBalance = function() {
        const amount = prompt("Enter amount to add:");
        if (amount !== null && !isNaN(amount) && amount.trim() !== "") {
            currentBalance += parseFloat(amount);
            updateBalance();
            localStorage.setItem('currentBalance', currentBalance);
        } else {
            alert("Please enter a valid amount.");
        }
    }

    // Add or Update Stock (including profit percentage)
    function addOrUpdateStock(e) {
        e.preventDefault();
        const itemName = document.getElementById("itemName").value.trim();
        const itemQuantity = parseInt(document.getElementById("itemQuantity").value);
        const itemPrice = parseFloat(document.getElementById("itemPrice").value);
        const profitPercent = parseFloat(prompt("Enter profit percentage on this item:", 0)); // Prompt for profit percentage

        if (isNaN(itemQuantity) || isNaN(itemPrice) || isNaN(profitPercent)) {
            alert("Please enter valid numerical values.");
            return;
        }

        if (stock[itemName]) {
            stock[itemName].quantity += itemQuantity;
            stock[itemName].price = itemPrice; // Update price if needed
            stock[itemName].profitPercent = profitPercent; // Update profit percentage
        } else {
            stock[itemName] = { quantity: itemQuantity, price: itemPrice, profitPercent: profitPercent };
        }

        currentBalance -= itemPrice * itemQuantity;
        updateBalance();
        displayStock();
        saveStock();

        // Clear form
        document.getElementById("stockForm").reset();
    }

    // Record Sale (with profit calculation)
    function recordSale(e) {
        e.preventDefault();
        const salesItem = document.getElementById("salesItem").value.trim();
        const salesQuantity = parseInt(document.getElementById("salesQuantity").value);

        if (isNaN(salesQuantity)) {
            alert("Please enter a valid quantity.");
            return;
        }

        if (stock[salesItem] && stock[salesItem].quantity >= salesQuantity) {
            stock[salesItem].quantity -= salesQuantity;

            // Calculate profit: price * quantity * (profitPercent / 100)
            const itemProfit = stock[salesItem].price * salesQuantity * (stock[salesItem].profitPercent / 100);

            // Add sale price and profit to balance
            const saleTotal = stock[salesItem].price * salesQuantity + itemProfit;
            currentBalance += saleTotal;

            dailyProfits.push(itemProfit);
            updateBalance();
            displayStock();
            displaySales(salesItem, salesQuantity, itemProfit);
            drawProfitGraph();
            saveStock();
            saveDailyProfits();

            // Clear form
            document.getElementById("salesForm").reset();

            alert(`Sold ${salesQuantity} of ${salesItem}. Profit: $${itemProfit.toFixed(2)}`);
        } else {
            alert("Insufficient stock!");
        }
    }

    // Record Expense
    function recordExpense(e) {
        e.preventDefault();
        const expenseDesc = document.getElementById("expenseDesc").value.trim();
        const expenseAmount = parseFloat(document.getElementById("expenseAmount").value);

        if (expenseDesc === "" || isNaN(expenseAmount)) {
            alert("Please enter valid expense details.");
            return;
        }

        currentBalance -= expenseAmount;
        dailyExpenses.push(expenseAmount);
        updateBalance();
        displayExpenses(expenseDesc, expenseAmount);
        drawExpenseGraph();
        saveDailyExpenses();

        // Clear form
        document.getElementById("expenseForm").reset();
    }

    // Update Balance Display
    function updateBalance() {
        currentBalanceEl.textContent = currentBalance.toFixed(2);
        localStorage.setItem('currentBalance', currentBalance);
    }

    // Display Stock List
    function displayStock() {
        const stockListEl = document.getElementById("stockList");
        stockListEl.innerHTML = `
            <table class="stock-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Profit (%)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        `;
        
        const tbody = stockListEl.querySelector("tbody");
    
        for (let item in stock) {
            tbody.innerHTML += `
                <tr>
                    <td class="stock-name">${item}</td>
                    <td>${stock[item].quantity}</td>
                    <td>$${stock[item].price}</td>
                    <td>${stock[item].profitPercent}%</td>
                    <td><button class="remove-btn" onclick="removeStock('${item}')"><i class="fa-solid fa-trash"></i></button></td>
                </tr>`;
        }
    }


    // Remove Stock Entry
    window.removeStock = function(itemName) {
        if (stock[itemName]) {
            const quantity = stock[itemName].quantity;
            const price = stock[itemName].price;
            currentBalance += quantity * price; // Add the original value back to current balance
            delete stock[itemName]; // Remove the item from stock
            updateBalance();
            displayStock();
            saveStock();
            alert(`${itemName} removed from stock. Current balance updated.`);
        } else {
            alert("Item not found in stock!");
        }
    }

    // Display Sales in Table
    function displaySales(item, quantity, profit) {
        const salesTableBody = document.getElementById("salesTable").querySelector("tbody");
        const row = salesTableBody.insertRow();
        row.innerHTML = `<td>${item}</td><td>${quantity}</td><td>$${profit.toFixed(2)}</td>`;
    }

    // Display Expenses in Table
    function displayExpenses(description, amount) {
        const expensesTableBody = document.getElementById("expensesTable").querySelector("tbody");
        const row = expensesTableBody.insertRow();
        row.innerHTML = `<td>${description}</td><td>$${amount.toFixed(2)}</td>`;
    }

    // Profit Visualization (using Chart.js)
    function drawProfitGraph() {
        const ctx = document.getElementById('profitGraph').getContext('2d');

        // Clear existing graph if it exists
        if (window.profitChart) {
            window.profitChart.destroy();
        }

        // Calculate net profit for each day
        const netProfits = dailyProfits.map((profit, index) => profit - (dailyExpenses[index] || 0));

        // Create the chart
        window.profitChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: netProfits.length }, (_, i) => `Day ${i + 1}`), // Dynamic labels
                datasets: [{
                    label: 'Net Daily Profit',
                    data: netProfits,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    fill: true,
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
            type: 'bar',
            data: {
                labels: Array.from({ length: dailyExpenses.length }, (_, i) => `Day ${i + 1}`), // Dynamic labels
                datasets: [{
                    label: 'Daily Expense',
                    data: dailyExpenses,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
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

    // Save stock to localStorage
    function saveStock() {
        localStorage.setItem('stock', JSON.stringify(stock));
    }

    // Save daily profits to localStorage
    function saveDailyProfits() {
        localStorage.setItem('dailyProfits', JSON.stringify(dailyProfits));
    }

    // Save daily expenses to localStorage
    function saveDailyExpenses() {
        localStorage.setItem('dailyExpenses', JSON.stringify(dailyExpenses));
    }
});


const hamburger = document.querySelector('.hamburger');
const profileSection = document.querySelector('.profile-section');

hamburger.addEventListener('click', () => {
    profileSection.classList.toggle('active');
});

