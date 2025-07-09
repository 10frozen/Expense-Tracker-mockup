// Expense data stored in localStorage or default sample
let expenses = JSON.parse(localStorage.getItem('expenses')) || [
  { name: 'Office Supplies', amount: 150.0 },
  { name: 'Business Lunch', amount: 75.5 },
  { name: 'Travel Expenses', amount: 450.25 },
  { name: 'Client Dinner', amount: 120.0 },
  { name: 'Hotel', amount: 275.75 },
];

const expensesTable = document.querySelector('.expenses-table');

// Render expenses list
function renderExpenses() {
  expensesTable.innerHTML = '';
  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');
    li.innerHTML = `
      <span>${expense.name}</span>
      <span>€${expense.amount.toFixed(2)}</span>
      <button class="btn btn-sm btn-danger ms-3 delete-expense" data-index="${index}">&times;</button>
    `;
    expensesTable.appendChild(li);
  });

  // Add delete button handlers
  document.querySelectorAll('.delete-expense').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      expenses.splice(idx, 1);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      renderExpenses();
      updateCharts();
    });
  });
}

// Add Expense form handling
const addExpenseForm = document.getElementById('addExpenseForm');
addExpenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('expenseName');
  const amountInput = document.getElementById('expenseAmount');

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (name && !isNaN(amount) && amount >= 0) {
    expenses.push({ name, amount });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    updateCharts();

    // Reset and hide modal
    addExpenseForm.reset();
    const modalEl = document.getElementById('addExpenseModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  } else {
    alert('Please enter valid expense name and amount');
  }
});

// Initial render
renderExpenses();

// ----------- Chart.js Setup -----------

const ctxTeam = document.getElementById('teamChart').getContext('2d');
const ctxCategory = document.getElementById('categoryChart').getContext('2d');

let teamChart, categoryChart;

// Example categories for demo (random allocation)
const categories = ['Office', 'Travel', 'Food', 'Hotel', 'Misc'];

function getRandomCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

// Map expenses to categories (for demo purpose)
function mapExpensesToCategories() {
  let catSums = {};
  categories.forEach((cat) => (catSums[cat] = 0));
  expenses.forEach((exp) => {
    // Randomly assign category
    const cat = getRandomCategory();
    catSums[cat] += exp.amount;
  });
  return catSums;
}

function updateCharts() {
  // Team chart data (static for demo)
  const teamData = {
    labels: ['Accounting', 'Sales', 'Marketing', 'IT', 'Management'],
    datasets: [
      {
        label: 'Team Expenses (€)',
        data: [1500, 1900, 1200, 1400, 1600],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderRadius: 5,
      },
    ],
  };

  // Day-to-day category chart (dynamic from expenses)
  const catSums = mapExpensesToCategories();
  const catLabels = Object.keys(catSums);
  const catValues = Object.values(catSums);

  // Destroy old charts if exist
  if (teamChart) teamChart.destroy();
  if (categoryChart) categoryChart.destroy();

  teamChart = new Chart(ctxTeam, {
    type: 'bar',
    data: teamData,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  categoryChart = new Chart(ctxCategory, {
    type: 'doughnut',
    data: {
      labels: catLabels,
      datasets: [
        {
          data: catValues,
          backgroundColor: [
            '#4682B4',
            '#00f5c3',
            '#FF6384',
            '#FFCE56',
            '#36A2EB',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
    },
  });
}

// Initialize charts
updateCharts();
