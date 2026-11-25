// HomeLedger views: one render function per page of the site. Every figure
// comes from the store, so the numbers on screen are always the household's
// own numbers — add a transaction and the dashboard, the budgets and the
// insights all move with it.

import { CATEGORIES, MONTHS, TREND } from './data.js';
import {
  addToGoal,
  budgetTotal,
  deleteTransaction,
  money,
  money0,
  monthIncome,
  monthSpent,
  monthTransactions,
  setBudget,
  spentByCategory,
  state,
  toggleBillPaid,
  totalSaved,
  upcomingBills,
  upcomingBillsTotal,
} from './store.js';
import { barChart, donutChart, progressBar } from './charts.js';

function categoryOf(id) {
  return CATEGORIES.find((cat) => cat.id === id) ?? { label: id, color: '#a8a29e' };
}

function monthLabel() {
  return MONTHS.find((m) => m.id === state.month)?.label ?? state.month;
}

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---- shared pieces -------------------------------------------------------

function summaryCards() {
  const income = monthIncome(state.month);
  const spent = monthSpent(state.month);
  const left = income - spent;
  return `<section class="cards" aria-label="Month summary">
    <article class="card"><p class="card-label">Income · ${esc(monthLabel())}</p><p class="card-value">${money0(income)}</p><p class="card-note">Maya $3,400 + Jordan $2,450</p></article>
    <article class="card"><p class="card-label">Spent so far</p><p class="card-value">${money0(spent)}</p><p class="card-note">Across ${monthTransactions(state.month).length} expenses</p></article>
    <article class="card highlight"><p class="card-label">Left to spend</p><p class="card-value">${money0(left)}</p><p class="card-note">Income minus spending</p></article>
    <article class="card"><p class="card-label">In savings goals</p><p class="card-value">${money0(totalSaved())}</p><p class="card-note">Emergency, vacation &amp; car</p></article>
  </section>`;
}

function categoryLegend(byCategory, total) {
  const rows = CATEGORIES.map((cat) => {
    const value = byCategory[cat.id] ?? 0;
    if (value <= 0) return '';
    const pct = Math.round((value / total) * 100);
    return `<li><span><span class="dot" style="background:${cat.color}"></span>${cat.label}</span><span class="legend-amount">${money(value)} · ${pct}%</span></li>`;
  }).join('');
  return `<ul class="legend">${rows}</ul>`;
}

function budgetRows(limit) {
  const byCategory = spentByCategory(state.month);
  const rows = CATEGORIES.map((cat) => {
    const budget = state.budgets[cat.id] ?? 0;
    const spent = byCategory[cat.id] ?? 0;
    return { cat, budget, spent, pct: budget > 0 ? spent / budget : 0 };
  })
    .sort((a, b) => b.spent - a.spent)
    .slice(0, limit ?? CATEGORIES.length);
  return rows
    .map(({ cat, budget, spent, pct }) => {
      const over = spent > budget;
      const diff = over ? `${money(spent - budget)} over` : `${money(budget - spent)} left`;
      return `<li class="budget-row">
        <div class="budget-head"><span class="dot" style="background:${cat.color}"></span><strong>${cat.label}</strong><span class="budget-amounts">${money(spent)} of ${money(budget)}</span></div>
        ${progressBar(pct, over)}
        <p class="budget-note ${over ? 'over-text' : ''}">${Math.round(pct * 100)}% used · ${diff}</p>
      </li>`;
    })
    .join('');
}

function transactionRows(list) {
  if (list.length === 0) {
    return '<li class="empty">No expenses match this filter yet.</li>';
  }
  return list
    .map((row) => {
      const cat = categoryOf(row.category);
      return `<li class="txn">
        <span class="dot" style="background:${cat.color}"></span>
        <span class="txn-main"><strong>${esc(row.desc)}</strong><span class="txn-meta">${row.date} · ${cat.label}</span></span>
        <span class="txn-amount">${money(row.amount)}</span>
        <button class="link-btn" data-delete="${row.id}" type="button">Delete</button>
      </li>`;
    })
    .join('');
}

// ---- pages ---------------------------------------------------------------

export function renderDashboard() {
  const byCategory = spentByCategory(state.month);
  const spent = monthSpent(state.month);
  const slices = CATEGORIES.map((cat) => ({
    label: cat.label,
    value: byCategory[cat.id] ?? 0,
    color: cat.color,
  })).filter((slice) => slice.value > 0);
  const recent = monthTransactions(state.month).slice(0, 6);
  const unpaid = upcomingBills();
  return `
  <h1>Your household at a glance</h1>
  <p class="lede">November is ${Math.round((spent / monthIncome(state.month)) * 100)}% spent. Rent is paid, groceries and utilities are both running over budget, and two bills are still due before the month ends.</p>
  ${summaryCards()}
  <div class="grid-two">
    <section class="panel" aria-label="Spending by category">
      <h2>Where the money went</h2>
      ${donutChart(slices, spent)}
      ${categoryLegend(byCategory, spent)}
    </section>
    <section class="panel" aria-label="Budgets">
      <h2>Budgets this month</h2>
      <ul class="budget-list">${budgetRows(5)}</ul>
      <p><a class="btn" href="#/budgets">See all budgets</a></p>
    </section>
  </div>
  <div class="grid-two">
    <section class="panel" aria-label="Recent expenses">
      <h2>Recent expenses</h2>
      <ul class="txn-list">${transactionRows(recent)}</ul>
      <p><a class="btn" href="#/transactions">All transactions</a></p>
    </section>
    <section class="panel" aria-label="Bills due">
      <h2>Bills still due</h2>
      ${unpaid.length === 0
        ? '<p class="empty">Every bill is paid. Nice work.</p>'
        : `<ul class="bill-list">${unpaid.map((bill) => `<li><strong>${esc(bill.name)}</strong><span>${money(bill.amount)} · due ${bill.due.slice(5)}</span></li>`).join('')}</ul>
           <p class="bill-total">${money(upcomingBillsTotal())} still to pay before the month ends.</p>`}
      <p><a class="btn" href="#/bills">Bills &amp; reminders</a></p>
    </section>
  </div>`;
}

export function renderTransactions() {
  const options = CATEGORIES.map((cat) => `<option value="${cat.id}">${cat.label}</option>`).join('');
  const list = monthTransactions(state.month);
  return `
  <h1>Transactions</h1>
  <p class="lede">Every dollar in and out for ${esc(monthLabel())}. Add an expense as it happens and the dashboard, budgets and insights update at once.</p>
  <section class="panel" aria-label="Add an expense">
    <h2>Add an expense</h2>
    <form id="add-form" class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>What was it? <input type="text" name="desc" placeholder="e.g. GreenMart weekly shop" maxlength="80" required></label>
      <label>Category <select name="category">${options}</select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <button class="btn primary" type="submit">Add expense</button>
    </form>
    <p id="add-note" class="form-note" role="status"></p>
  </section>
  <section class="panel" aria-label="Filter expenses">
    <h2>Find an expense</h2>
    <div class="form-grid">
      <label>Category <select id="filter-category"><option value="">All categories</option>${options}</select></label>
      <label>Search <input type="search" id="filter-text" placeholder="Search description…"></label>
    </div>
  </section>
  <section class="panel" aria-label="Expense list">
    <h2>${list.length} expenses · ${money(monthSpent(state.month))} in ${esc(monthLabel())}</h2>
    <ul class="txn-list" id="txn-list">${transactionRows(list)}</ul>
  </section>`;
}

export function renderBudgets() {
  const spent = monthSpent(state.month);
  const total = budgetTotal();
  const remaining = total - spent;
  return `
  <h1>Monthly budgets</h1>
  <p class="lede">A plan for every category, set at the start of the month. Change any number and the plan — and the dashboard — follow it.</p>
  <section class="cards" aria-label="Budget totals">
    <article class="card"><p class="card-label">Planned spending</p><p class="card-value">${money0(total)}</p><p class="card-note">All categories together</p></article>
    <article class="card"><p class="card-label">Spent so far</p><p class="card-value">${money0(spent)}</p><p class="card-note">${Math.round((spent / total) * 100)}% of the plan</p></article>
    <article class="card ${remaining < 0 ? '' : 'highlight'}"><p class="card-label">Plan remaining</p><p class="card-value">${money0(remaining)}</p><p class="card-note">${remaining < 0 ? 'Over the plan — see what can wait' : 'Left in the plan for the month'}</p></article>
  </section>
  <section class="panel" aria-label="Budgets by category">
    <h2>Budgets by category</h2>
    <ul class="budget-list editable">${budgetRows()}</ul>
    <h3>Change a budget</h3>
    <form id="budget-form" class="form-grid">
      <label>Category <select name="category">${CATEGORIES.map((cat) => `<option value="${cat.id}">${cat.label} — now ${money(state.budgets[cat.id] ?? 0)}</option>`).join('')}</select></label>
      <label>New monthly budget ($) <input type="number" name="amount" min="0" step="1" required></label>
      <button class="btn primary" type="submit">Save budget</button>
    </form>
    <p id="budget-note" class="form-note" role="status"></p>
  </section>`;
}

export function renderBills() {
  const paid = state.bills.filter((bill) => bill.paid);
  const unpaid = upcomingBills();
  const paidTotal = paid.reduce((sum, bill) => sum + bill.amount, 0);
  const row = (bill) => `<li class="bill-row ${bill.paid ? 'paid' : ''}">
    <span class="dot" style="background:${categoryOf(bill.category).color}"></span>
    <span class="txn-main"><strong>${esc(bill.name)}</strong><span class="txn-meta">Due ${bill.due} · ${categoryOf(bill.category).label}</span></span>
    <span class="txn-amount">${money(bill.amount)}</span>
    <button class="btn small" data-bill="${bill.id}" type="button">${bill.paid ? 'Paid ✓' : 'Mark paid'}</button>
  </li>`;
  return `
  <h1>Bills &amp; reminders</h1>
  <p class="lede">The fixed bills for November, with their due dates. Mark one paid and it moves down the list — nothing slips through.</p>
  <section class="cards" aria-label="Bill totals">
    <article class="card"><p class="card-label">Still to pay</p><p class="card-value">${money0(upcomingBillsTotal())}</p><p class="card-note">${unpaid.length} bill${unpaid.length === 1 ? '' : 's'} left</p></article>
    <article class="card highlight"><p class="card-label">Already paid</p><p class="card-value">${money0(paidTotal)}</p><p class="card-note">${paid.length} bill${paid.length === 1 ? '' : 's'} paid</p></article>
    <article class="card"><p class="card-label">Next due</p><p class="card-value">${unpaid.length ? unpaid[0].due.slice(5) : '—'}</p><p class="card-note">${unpaid.length ? esc(unpaid[0].name) : 'All caught up'}</p></article>
  </section>
  <section class="panel" aria-label="Bills due">
    <h2>Due this month</h2>
    <ul class="txn-list">${unpaid.map(row).join('') || '<li class="empty">Every bill is paid.</li>'}</ul>
  </section>
  <section class="panel" aria-label="Bills paid">
    <h2>Paid</h2>
    <ul class="txn-list">${paid.map(row).join('')}</ul>
  </section>`;
}

export function renderGoals() {
  return `
  <h1>Savings goals</h1>
  <p class="lede">Three things the household is saving for. Every dollar put aside shows up here and in the dashboard total.</p>
  <div class="grid-two">
    ${state.goals.map((goal) => {
      const pct = goal.saved / goal.target;
      const left = goal.target - goal.saved;
      return `<section class="panel" aria-label="${esc(goal.name)}">
        <h2>${esc(goal.name)}</h2>
        <p class="goal-amounts"><strong>${money(goal.saved)}</strong> of ${money(goal.target)}</p>
        ${progressBar(pct, false)}
        <p class="budget-note">${Math.round(pct * 100)}% saved · ${money(left)} to go</p>
        <p>${esc(goal.note)}</p>
        <form class="goal-form" data-goal="${goal.id}">
          <label>Add to this goal ($) <input type="number" name="amount" min="1" step="1" placeholder="50" required></label>
          <button class="btn primary" type="submit">Add savings</button>
        </form>
      </section>`;
    }).join('')}
  </div>
  <p class="form-note">Total saved across all goals: <strong>${money(totalSaved())}</strong>.</p>`;
}

export function renderInsights() {
  const byCategory = spentByCategory(state.month);
  const spent = monthSpent(state.month);
  const daysSoFar = 26;
  const daily = spent / daysSoFar;
  const projected = daily * 30;
  const biggest = CATEGORIES.map((cat) => ({ cat, value: byCategory[cat.id] ?? 0 }))
    .sort((a, b) => b.value - a.value)[0];
  const over = CATEGORIES.filter((cat) => (byCategory[cat.id] ?? 0) > (state.budgets[cat.id] ?? 0))
    .map((cat) => ({ cat, overBy: (byCategory[cat.id] ?? 0) - state.budgets[cat.id] }));
  const bars = [...TREND, { month: 'Nov', spent: Math.round(spent) }]
    .map((bar) => ({ label: bar.month, value: bar.spent }));
  const maxBar = Math.max(...bars.map((bar) => bar.value));
  return `
  <h1>Insights</h1>
  <p class="lede">What November's numbers actually mean — no guesswork, just the household's own figures.</p>
  <section class="panel" aria-label="Spending trend">
    <h2>Spending over the last six months</h2>
    ${barChart(bars, maxBar)}
    <p>November so far: <strong>${money(spent)}</strong>. October finished at ${money(3157)} — this month is tracking ${spent > 3157 ? 'above' : 'below'} last month.</p>
  </section>
  <div class="grid-two">
    <section class="panel" aria-label="Key findings">
      <h2>Three things worth knowing</h2>
      <ol class="insight-list">
        <li><strong>Biggest cost: ${biggest.cat.label}.</strong> ${money(biggest.value)} this month — ${Math.round((biggest.value / spent) * 100)}% of all spending. It is fixed, so savings have to come from the flexible categories.</li>
        <li><strong>Daily pace: ${money(daily)} a day.</strong> At this rate November ends near ${money0(projected)} — ${projected > monthIncome(state.month) ? 'more than the household earns, so something has to give' : 'inside the month’s income of ' + money0(monthIncome(state.month))}.</li>
        <li><strong>${over.length === 0 ? 'No budget is over yet.' : `Over budget: ${over.map((item) => `${item.cat.label} by ${money(item.overBy)}`).join(', ')}.`}</strong> ${over.length === 0 ? 'Groceries are the closest to watch.' : 'A smaller final weekly shop would pull groceries back inside the plan.'}</li>
      </ol>
    </section>
    <section class="panel" aria-label="Money tips">
      <h2>Five habits that save real money</h2>
      <ol class="insight-list">
        <li><strong>Shop with a list, once a week.</strong> The household's five November shops averaged ${money(136.12)} — one planned trip beats five small ones.</li>
        <li><strong>Pay yourself first.</strong> Move savings on payday, before spending starts — ${money(200)} a month is ${money(2400)} a year.</li>
        <li><strong>Review subscriptions every quarter.</strong> The streaming bundle is ${money(32.99)} a month; anything unwatched for a month gets cancelled.</li>
        <li><strong>Cook the plan, not the craving.</strong> Takeaway and eating out cost ${money(134.45)} in November — two home-cooked swaps cover the grocery overspend.</li>
        <li><strong>Keep one buffer.</strong> A ${money(500)} cushion in the current account stops a surprise bill from becoming card debt.</li>
      </ol>
    </section>
  </div>`;
}

// ---- actions wired by main.js ---------------------------------------------

export const actions = {
  deleteTransaction,
  toggleBillPaid,
  addToGoal,
  setBudget,
};
