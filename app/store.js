// HomeLedger store: the household's budget state, kept in memory and saved to
// localStorage after every change, so the site works offline and remembers
// what the household entered. Falls back to memory only when storage is
// unavailable (for example on a hosted page that blocks it).

import { BUDGETS, BILLS, GOALS, INCOME, TRANSACTIONS } from './data.js';

const KEY = 'homeledger-state-v1';

function loadSeed() {
  return {
    month: '2026-11',
    budgets: { ...BUDGETS },
    income: INCOME.map((row) => ({ ...row })),
    transactions: TRANSACTIONS.map((row) => ({ ...row })),
    bills: BILLS.map((row) => ({ ...row })),
    goals: GOALS.map((row) => ({ ...row })),
  };
}

function readSaved() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const state = readSaved() ?? loadSeed();

export function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage blocked: the site keeps working in memory for this visit.
  }
}

export function resetAll() {
  const fresh = loadSeed();
  Object.assign(state, fresh);
  save();
}

// ---- money helpers -------------------------------------------------------

export function money(amount) {
  return '$' + Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function money0(amount) {
  return '$' + Math.round(Number(amount)).toLocaleString('en-US');
}

// ---- computed figures for one month --------------------------------------

export function monthIncome(monthId) {
  return state.income
    .filter((row) => row.month === monthId)
    .reduce((sum, row) => sum + row.amount, 0);
}

export function monthTransactions(monthId) {
  return state.transactions
    .filter((row) => row.month === monthId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function monthSpent(monthId) {
  return state.transactions
    .filter((row) => row.month === monthId)
    .reduce((sum, row) => sum + row.amount, 0);
}

export function spentByCategory(monthId) {
  const totals = {};
  for (const row of state.transactions) {
    if (row.month !== monthId) continue;
    totals[row.category] = (totals[row.category] ?? 0) + row.amount;
  }
  return totals;
}

export function budgetTotal() {
  return Object.values(state.budgets).reduce((sum, value) => sum + value, 0);
}

export function upcomingBills() {
  return state.bills.filter((bill) => !bill.paid);
}

export function upcomingBillsTotal() {
  return upcomingBills().reduce((sum, bill) => sum + bill.amount, 0);
}

export function totalSaved() {
  return state.goals.reduce((sum, goal) => sum + goal.saved, 0);
}

// ---- edits ---------------------------------------------------------------

let counter = Date.now() % 100000;

export function addTransaction({ date, desc, category, amount }) {
  counter += 1;
  const month = date.slice(0, 7);
  const row = {
    id: `t-user-${counter}`,
    month,
    date,
    desc: desc.trim(),
    category,
    amount: Math.round(Number(amount) * 100) / 100,
  };
  state.transactions.push(row);
  save();
  return row;
}

export function deleteTransaction(id) {
  const index = state.transactions.findIndex((row) => row.id === id);
  if (index !== -1) {
    state.transactions.splice(index, 1);
    save();
    return true;
  }
  return false;
}

export function setBudget(categoryId, amount) {
  state.budgets[categoryId] = Math.max(0, Math.round(Number(amount) * 100) / 100);
  save();
}

export function toggleBillPaid(id) {
  const bill = state.bills.find((row) => row.id === id);
  if (bill) {
    bill.paid = !bill.paid;
    save();
  }
}

export function addToGoal(id, amount) {
  const goal = state.goals.find((row) => row.id === id);
  if (goal) {
    goal.saved = Math.round((goal.saved + Number(amount)) * 100) / 100;
    save();
  }
}
