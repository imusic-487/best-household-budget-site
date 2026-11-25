// HomeLedger main: the router and the wiring. Hash routes pick a page
// (#/, #/transactions, #/budgets, #/bills, #/goals, #/insights); every
// button and form on the page is handled here, and every change re-renders
// the current page from the store.

import { CATEGORIES, MONTHS } from './data.js';
import {
  addTransaction,
  monthSpent,
  monthTransactions,
  money,
  state,
} from './store.js';
import {
  actions,
  renderBills,
  renderBudgets,
  renderDashboard,
  renderGoals,
  renderInsights,
  renderTransactions,
} from './views.js';

const outlet = document.getElementById('page');
const monthSelect = document.getElementById('month-select');
const nav = document.getElementById('main-nav');

const ROUTES = {
  '': renderDashboard,
  transactions: renderTransactions,
  budgets: renderBudgets,
  bills: renderBills,
  goals: renderGoals,
  insights: renderInsights,
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return ROUTES[hash] ? hash : '';
}

function render() {
  const route = currentRoute();
  outlet.innerHTML = ROUTES[route]();
  for (const link of nav.querySelectorAll('a')) {
    const target = link.getAttribute('href').replace(/^#\/?/, '');
    if (target === route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  wirePage(route);
  window.scrollTo(0, 0);
}

function rerenderList() {
  const list = document.getElementById('txn-list');
  if (!list) return;
  const category = document.getElementById('filter-category').value;
  const text = document.getElementById('filter-text').value.trim().toLowerCase();
  const rows = monthTransactions(state.month).filter((row) => {
    if (category && row.category !== category) return false;
    if (text && !row.desc.toLowerCase().includes(text)) return false;
    return true;
  });
  const heading = list.closest('section').querySelector('h2');
  if (heading) heading.textContent = `${rows.length} expenses · ${money(monthSpent(state.month))} in total`;
  list.innerHTML = rows.length === 0
    ? '<li class="empty">No expenses match this filter yet.</li>'
    : rows.map((row) => `<li class="txn">
        <span class="dot" style="background:${categoryColor(row.category)}"></span>
        <span class="txn-main"><strong>${escapeHtml(row.desc)}</strong><span class="txn-meta">${row.date} · ${categoryLabel(row.category)}</span></span>
        <span class="txn-amount">${money(row.amount)}</span>
        <button class="link-btn" data-delete="${row.id}" type="button">Delete</button>
      </li>`).join('');
}

function categoryColor(id) {
  return CATEGORIES.find((cat) => cat.id === id)?.color ?? '#a8a29e';
}

function categoryLabel(id) {
  return CATEGORIES.find((cat) => cat.id === id)?.label ?? id;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wirePage(route) {
  // Delete buttons (dashboard + transactions).
  outlet.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      actions.deleteTransaction(button.getAttribute('data-delete'));
      render();
    });
  });

  // Bill paid toggles.
  outlet.querySelectorAll('[data-bill]').forEach((button) => {
    button.addEventListener('click', () => {
      actions.toggleBillPaid(button.getAttribute('data-bill'));
      render();
    });
  });

  // Savings goal forms.
  outlet.querySelectorAll('.goal-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const amount = Number(new FormData(form).get('amount'));
      if (Number.isFinite(amount) && amount > 0) {
        actions.addToGoal(form.getAttribute('data-goal'), amount);
        render();
      }
    });
  });

  if (route === 'transactions') {
    const addForm = document.getElementById('add-form');
    addForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(addForm);
      const row = addTransaction({
        date: String(data.get('date')),
        desc: String(data.get('desc')),
        category: String(data.get('category')),
        amount: Number(data.get('amount')),
      });
      document.getElementById('add-note').textContent =
        `Added ${money(row.amount)} — ${row.desc}. The dashboard and budgets now include it.`;
      addForm.reset();
      addForm.querySelector('[name="date"]').value = '2026-11-26';
      render();
    });
    document.getElementById('filter-category').addEventListener('change', rerenderList);
    document.getElementById('filter-text').addEventListener('input', rerenderList);
  }

  if (route === 'budgets') {
    const budgetForm = document.getElementById('budget-form');
    budgetForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(budgetForm);
      actions.setBudget(String(data.get('category')), Number(data.get('amount')));
      document.getElementById('budget-note').textContent = 'Budget saved — the plan above already shows it.';
      render();
    });
  }
}

// Month switcher in the header.
for (const month of MONTHS) {
  const option = document.createElement('option');
  option.value = month.id;
  option.textContent = month.label;
  monthSelect.append(option);
}
monthSelect.value = state.month;
monthSelect.addEventListener('change', () => {
  state.month = monthSelect.value;
  render();
});

window.addEventListener('hashchange', render);

render();
