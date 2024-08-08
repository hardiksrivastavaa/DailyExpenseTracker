// Global variables
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let expenses = JSON.parse(localStorage.getItem('expenses')) || {};

// Utility functions
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveCurrentUser() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Authentication functions
function registerUser(name, email, password) {
    if (!name || !email || !password) {
        alert("Please fill in all fields");
        return false;
    }

    const userExists = users.some(user => user.email === email);
    if (userExists) {
        alert("User already registered");
        return false;
    }

    users.push({ name, email, password });
    saveUsers();
    alert("Successfully registered");
    return true;
}

function loginUser(email, password) {
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        alert("Invalid login details");
        return false;
    }

    currentUser = user;
    saveCurrentUser();
    return true;
}

function logoutUser() {
    currentUser = null;
    saveCurrentUser();
}

// Expense functions
function addExpense(name, amount, date) {
    if (!name || !amount || !date) {
        alert("Please fill in all fields");
        return;
    }

    if (!expenses[date]) {
        expenses[date] = [];
    }

    expenses[date].push({ name, amount: parseFloat(amount) });
    saveExpenses();
    renderExpenses(date);
    calculateAndDisplaySummary(date);
    clearExpenseInputs();
}

function deleteExpense(date, index) {
    expenses[date].splice(index, 1);
    saveExpenses();
    renderExpenses(date);
    calculateAndDisplaySummary(date);
}

function renderExpenses(date) {
    const expensesList = document.getElementById('expenses-list');
    expensesList.innerHTML = '';

    if (expenses[date]) {
        expenses[date].forEach((expense, index) => {
            const expenseItem = document.createElement('div');
            expenseItem.classList.add('expense-item');
            expenseItem.innerHTML = `
                <span>${expense.name} - $${expense.amount.toFixed(2)}</span>
                <button onclick="deleteExpense('${date}', ${index})">Delete</button>
            `;
            expensesList.appendChild(expenseItem);
        });
    }
}

function calculateAndDisplaySummary(date) {
    const dailyTotal = expenses[date] ? expenses[date].reduce((sum, expense) => sum + expense.amount, 0) : 0;
    document.getElementById('daily-summary').innerText = `Total Daily Expenses: $${dailyTotal.toFixed(2)}`;

    const monthlyTotal = Object.keys(expenses).reduce((sum, key) => {
        if (key.startsWith(date.slice(0, 7))) {
            return sum + expenses[key].reduce((subSum, expense) => subSum + expense.amount, 0);
        }
        return sum;
    }, 0);

    document.getElementById('monthly-summary').innerText = `Total Monthly Expenses: $${monthlyTotal.toFixed(2)}`;
}

function clearExpenseInputs() {
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-date').value = '';
}

// UI interactions
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-container');
    const registerForm = document.getElementById('register-container');
    const trackerContainer = document.getElementById('tracker-container');

    if (loginForm) {
        document.getElementById('login-btn').addEventListener('click', () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (loginUser(email, password)) {
                window.location.href = 'tracker.html';
            } else {
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
            }
        });
    }

    if (registerForm) {
        document.getElementById('register-btn').addEventListener('click', () => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (registerUser(name, email, password)) {
                window.location.href = 'login.html';
            } else {
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
            }
        });
    }

    if (trackerContainer) {
        document.getElementById('expense-date').addEventListener('change', (event) => {
            const selectedDate = event.target.value;
            renderExpenses(selectedDate);
            calculateAndDisplaySummary(selectedDate);
        });

        document.getElementById('add-expense-btn').addEventListener('click', () => {
            const name = document.getElementById('expense-name').value;
            const amount = document.getElementById('expense-amount').value;
            const date = document.getElementById('expense-date').value;

            addExpense(name, amount, date);
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            logoutUser();
            window.location.href = 'index.html';
        });

        const currentDate = new Date().toISOString().split('T')[0];
        document.getElementById('expense-date').value = currentDate;
        renderExpenses(currentDate);
        calculateAndDisplaySummary(currentDate);
    }
});
