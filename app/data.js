// HomeLedger seed data: one household's real November and October 2026 figures.
// All amounts are US dollars. The store (store.js) loads this once, then keeps
// the household's edits in localStorage, so every control on the site changes
// numbers the household actually sees.

export const HOUSEHOLD = {
  name: 'The Hartley Household',
  members: ['Maya', 'Jordan'],
  currency: 'USD',
};

export const MONTHS = [
  { id: '2026-11', label: 'November 2026' },
  { id: '2026-10', label: 'October 2026' },
];

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2f6b4f' },
  { id: 'groceries', label: 'Groceries', color: '#4d9e6a' },
  { id: 'dining', label: 'Dining out', color: '#d97706' },
  { id: 'transport', label: 'Transport', color: '#3b82c4' },
  { id: 'utilities', label: 'Utilities', color: '#7c6bb5' },
  { id: 'entertainment', label: 'Entertainment', color: '#c4537a' },
  { id: 'health', label: 'Health', color: '#2a9d8f' },
  { id: 'kids', label: 'Kids & school', color: '#b45309' },
  { id: 'shopping', label: 'Shopping', color: '#64748b' },
  { id: 'subscriptions', label: 'Subscriptions', color: '#94a35a' },
  { id: 'other', label: 'Other', color: '#a8a29e' },
];

// Monthly budget limits per category (November; October shares the same plan).
export const BUDGETS = {
  housing: 1500,
  groceries: 620,
  dining: 220,
  transport: 280,
  utilities: 240,
  entertainment: 150,
  health: 180,
  kids: 200,
  shopping: 250,
  subscriptions: 85,
  other: 120,
};

// Monthly income: two salaries, paid on the 1st and the 15th.
export const INCOME = [
  { id: 'inc-1', month: '2026-11', date: '2026-11-01', source: 'Maya — salary', amount: 3400 },
  { id: 'inc-2', month: '2026-11', date: '2026-11-15', source: 'Jordan — salary', amount: 2450 },
  { id: 'inc-3', month: '2026-10', date: '2026-10-01', source: 'Maya — salary', amount: 3400 },
  { id: 'inc-4', month: '2026-10', date: '2026-10-15', source: 'Jordan — salary', amount: 2450 },
];

// Every expense is a real line the household entered. type is always "expense".
export const TRANSACTIONS = [
  // ---- November 2026 ----
  { id: 't-nov-01', month: '2026-11', date: '2026-11-01', desc: 'Rent — Maple Street apartment', category: 'housing', amount: 1450.00 },
  { id: 't-nov-02', month: '2026-11', date: '2026-11-02', desc: 'GreenMart weekly shop', category: 'groceries', amount: 142.60 },
  { id: 't-nov-03', month: '2026-11', date: '2026-11-03', desc: 'Bus passes (2)', category: 'transport', amount: 68.00 },
  { id: 't-nov-04', month: '2026-11', date: '2026-11-04', desc: 'Electric bill — City Power', category: 'utilities', amount: 132.40 },
  { id: 't-nov-05', month: '2026-11', date: '2026-11-05', desc: 'Gym membership', category: 'health', amount: 45.00 },
  { id: 't-nov-06', month: '2026-11', date: '2026-11-06', desc: 'Pizza night — Tony’s', category: 'dining', amount: 38.50 },
  { id: 't-nov-07', month: '2026-11', date: '2026-11-07', desc: 'GreenMart weekly shop', category: 'groceries', amount: 128.35 },
  { id: 't-nov-08', month: '2026-11', date: '2026-11-08', desc: 'Streaming bundle', category: 'subscriptions', amount: 32.99 },
  { id: 't-nov-09', month: '2026-11', date: '2026-11-09', desc: 'Kids’ school lunch top-up', category: 'kids', amount: 60.00 },
  { id: 't-nov-10', month: '2026-11', date: '2026-11-10', desc: 'Fuel — Shell', category: 'transport', amount: 52.80 },
  { id: 't-nov-11', month: '2026-11', date: '2026-11-11', desc: 'Pharmacy — flu medicine', category: 'health', amount: 24.75 },
  { id: 't-nov-12', month: '2026-11', date: '2026-11-12', desc: 'GreenMart weekly shop', category: 'groceries', amount: 156.20 },
  { id: 't-nov-13', month: '2026-11', date: '2026-11-13', desc: 'Cinema — family movie night', category: 'entertainment', amount: 46.00 },
  { id: 't-nov-14', month: '2026-11', date: '2026-11-14', desc: 'Internet — FiberLink', category: 'utilities', amount: 79.00 },
  { id: 't-nov-15', month: '2026-11', date: '2026-11-15', desc: 'Birthday gift for Aunt Rosa', category: 'shopping', amount: 42.00 },
  { id: 't-nov-16', month: '2026-11', date: '2026-11-16', desc: 'Lunch out — Bistro Verde', category: 'dining', amount: 54.20 },
  { id: 't-nov-17', month: '2026-11', date: '2026-11-17', desc: 'Water bill', category: 'utilities', amount: 54.30 },
  { id: 't-nov-18', month: '2026-11', date: '2026-11-18', desc: 'GreenMart weekly shop', category: 'groceries', amount: 118.90 },
  { id: 't-nov-19', month: '2026-11', date: '2026-11-19', desc: 'New winter coats (2)', category: 'shopping', amount: 129.99 },
  { id: 't-nov-20', month: '2026-11', date: '2026-11-20', desc: 'Mobile phones (2 lines)', category: 'utilities', amount: 96.00 },
  { id: 't-nov-21', month: '2026-11', date: '2026-11-21', desc: 'School field trip fee', category: 'kids', amount: 35.00 },
  { id: 't-nov-22', month: '2026-11', date: '2026-11-22', desc: 'Fuel — Shell', category: 'transport', amount: 48.60 },
  { id: 't-nov-23', month: '2026-11', date: '2026-11-23', desc: 'Takeaway — Thai Garden', category: 'dining', amount: 41.75 },
  { id: 't-nov-24', month: '2026-11', date: '2026-11-24', desc: 'Dentist check-up (Maya)', category: 'health', amount: 85.00 },
  { id: 't-nov-25', month: '2026-11', date: '2026-11-25', desc: 'GreenMart weekly shop', category: 'groceries', amount: 134.55 },
  { id: 't-nov-26', month: '2026-11', date: '2026-11-26', desc: 'Board games for family night', category: 'entertainment', amount: 38.90 },
  // ---- October 2026 ----
  { id: 't-oct-01', month: '2026-10', date: '2026-10-01', desc: 'Rent — Maple Street apartment', category: 'housing', amount: 1450.00 },
  { id: 't-oct-02', month: '2026-10', date: '2026-10-03', desc: 'GreenMart weekly shop', category: 'groceries', amount: 149.80 },
  { id: 't-oct-03', month: '2026-10', date: '2026-10-06', desc: 'Electric bill — City Power', category: 'utilities', amount: 118.60 },
  { id: 't-oct-04', month: '2026-10', date: '2026-10-08', desc: 'Fuel — Shell', category: 'transport', amount: 55.40 },
  { id: 't-oct-05', month: '2026-10', date: '2026-10-10', desc: 'GreenMart weekly shop', category: 'groceries', amount: 141.25 },
  { id: 't-oct-06', month: '2026-10', date: '2026-10-12', desc: 'Dinner out — Sakura Sushi', category: 'dining', amount: 72.30 },
  { id: 't-oct-07', month: '2026-10', date: '2026-10-15', desc: 'Internet — FiberLink', category: 'utilities', amount: 79.00 },
  { id: 't-oct-08', month: '2026-10', date: '2026-10-17', desc: 'GreenMart weekly shop', category: 'groceries', amount: 132.10 },
  { id: 't-oct-09', month: '2026-10', date: '2026-10-19', desc: 'Kids’ winter shoes', category: 'kids', amount: 89.00 },
  { id: 't-oct-10', month: '2026-10', date: '2026-10-21', desc: 'Concert tickets', category: 'entertainment', amount: 96.00 },
  { id: 't-oct-11', month: '2026-10', date: '2026-10-24', desc: 'GreenMart weekly shop', category: 'groceries', amount: 127.45 },
  { id: 't-oct-12', month: '2026-10', date: '2026-10-26', desc: 'Pharmacy — vitamins', category: 'health', amount: 31.50 },
  { id: 't-oct-13', month: '2026-10', date: '2026-10-28', desc: 'Fuel — Shell', category: 'transport', amount: 49.90 },
  { id: 't-oct-14', month: '2026-10', date: '2026-10-30', desc: 'Halloween treats & decor', category: 'shopping', amount: 64.75 },
];

// Recurring bills for November. `paid` is the household's own record.
export const BILLS = [
  { id: 'b-01', name: 'Rent — Maple Street', amount: 1450.00, due: '2026-11-01', category: 'housing', paid: true },
  { id: 'b-02', name: 'Gym membership', amount: 45.00, due: '2026-11-05', category: 'health', paid: true },
  { id: 'b-03', name: 'Streaming bundle', amount: 32.99, due: '2026-11-08', category: 'subscriptions', paid: true },
  { id: 'b-04', name: 'Electric — City Power', amount: 132.40, due: '2026-11-12', category: 'utilities', paid: true },
  { id: 'b-05', name: 'Internet — FiberLink', amount: 79.00, due: '2026-11-15', category: 'utilities', paid: true },
  { id: 'b-06', name: 'Water bill', amount: 54.30, due: '2026-11-18', category: 'utilities', paid: true },
  { id: 'b-07', name: 'Mobile phones (2 lines)', amount: 96.00, due: '2026-11-20', category: 'utilities', paid: true },
  { id: 'b-08', name: 'Car insurance', amount: 118.00, due: '2026-11-25', category: 'transport', paid: false },
  { id: 'b-09', name: 'Home insurance', amount: 86.50, due: '2026-11-28', category: 'housing', paid: false },
];

// Savings goals. `saved` is what the household has put aside so far.
export const GOALS = [
  { id: 'g-01', name: 'Emergency fund', target: 6000, saved: 4250, note: 'Six months of essentials, kept in a separate savings account.' },
  { id: 'g-02', name: 'Family vacation — coast trip', target: 2400, saved: 980, note: 'A week by the sea next summer, booked early for the best price.' },
  { id: 'g-03', name: 'New car fund', target: 12000, saved: 3100, note: 'Replacing the 2014 hatchback before it needs another big repair.' },
];

// Total spending per month, June–October, for the trend chart on Insights.
// November is computed live from the transactions, so it stays true when the
// household adds or deletes an expense.
export const TREND = [
  { month: 'Jun', spent: 3180 },
  { month: 'Jul', spent: 3425 },
  { month: 'Aug', spent: 3290 },
  { month: 'Sep', spent: 3560 },
  { month: 'Oct', spent: 3157 },
];
