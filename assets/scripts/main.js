document.addEventListener("DOMContentLoaded", () => {
    const currentBalanceEl = document.getElementById("currentBalance");
    let currentBalance = 0;
    let stock = {};

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

            updateBalance();
            displayStock();

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
        updateBalance();
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

    // Profit Visualization (using Chart.js)
    function drawProfitGraph() {
        const ctx = document.getElementById('profitGraph').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                datasets: [{
                    label: 'Daily Profit',
                    data: [12, 19, 3, 5, 2],
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

    drawProfitGraph();
});
