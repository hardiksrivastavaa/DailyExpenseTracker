document.addEventListener('DOMContentLoaded', () => {
    const expenseDate = document.getElementById('expense-date');
    const expenseName = document.getElementById('expense-name');
    const expenseAmount = document.getElementById('expense-amount');
    const dailyTotalElem = document.getElementById('daily-total');
    const monthlyTotalElem = document.getElementById('monthly-total');
    const expenseList = document.getElementById('expense-list');
    const selectedDateElem = document.getElementById('selected-date');
    
    const initialize = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            if (document.getElementById('welcome-page')) {
                document.getElementById('welcome-page').style.display = 'none';
            }
            if (document.getElementById('auth-section')) {
                document.getElementById('auth-section').style.display = 'none';
            }
            if (document.getElementById('expense-section')) {
                document.getElementById('expense-section').style.display = 'block';
            }
            loadExpenses();
        }
    };

    const handleLogin = () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = 'tracker.html';
        } else {
            alert('Invalid email or password');
        }
    };

    const handleRegister = () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.email === email)) {
            alert('Email is already registered');
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Successfully registered');
        document.getElementById('name').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        window.location.href = 'login.html';
    };

    const handleAddExpense = () => {
        const date = expenseDate.value;
        const name = expenseName.value;
        const amount = parseFloat(expenseAmount.value);

        if (!date || !name || isNaN(amount) || amount <= 0) {
            alert('Please provide valid expense details');
            return;
        }

        const expenses = JSON.parse(localStorage.getItem('expenses')) || {};
        if (!expenses[date]) {
            expenses[date] = [];
        }
        expenses[date].push({ name, amount });
        localStorage.setItem('expenses', JSON.stringify(expenses));

        expenseName.value = '';
        expenseAmount.value = '';
        updateTotals();
    };

    const handleSaveAndLogout = () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    };

    const updateTotals = () => {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || {};
        const date = expenseDate.value;
        const dailyExpenses = expenses[date] || [];

        const dailyTotal = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const monthlyTotal = Object.values(expenses).flat().reduce((sum, exp) => sum + exp.amount, 0);

        dailyTotalElem.textContent = dailyTotal.toFixed(2);
        monthlyTotalElem.textContent = monthlyTotal.toFixed(2);

        expenseList.innerHTML = dailyExpenses.map((exp, index) => `
            <li class="flex justify-between items-center mb-2">
                <span>${exp.name}: ₹${exp.amount.toFixed(2)}</span>
                <button class="text-red-500 hover:text-red-700" onclick="deleteExpense('${date}', ${index})">Delete</button>
            </li>
        `).join('');
    };

    const loadExpenses = () => {
        updateTotals();
        const date = expenseDate.value;
        selectedDateElem.textContent = date ? `Selected Date: ${date}` : 'Select a date';
    };

    window.deleteExpense = (date, index) => {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || {};
        if (expenses[date]) {
            expenses[date].splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            updateTotals();
        }
    };

    // Event Listeners
    if (document.getElementById('login-btn')) {
        document.getElementById('login-btn').addEventListener('click', handleLogin);
    }

    if (document.getElementById('register-btn')) {
        document.getElementById('register-btn').addEventListener('click', handleRegister);
    }

    if (document.getElementById('add-expense-btn')) {
        document.getElementById('add-expense-btn').addEventListener('click', handleAddExpense);
    }

    if (document.getElementById('save-and-logout-btn')) {
        document.getElementById('save-and-logout-btn').addEventListener('click', handleSaveAndLogout);
    }

    if (document.getElementById('expense-date')) {
        document.getElementById('expense-date').addEventListener('change', loadExpenses);
    }

    initialize();
});
