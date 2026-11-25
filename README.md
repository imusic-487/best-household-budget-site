# HomeLedger — Household Budget

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/imusic-487/best-household-budget-site/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/imusic-487/best-household-budget-site/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

A household budget site that runs entirely in the browser, offline, on a
desktop and on a phone. No accounts, no network requests, no build step —
just open `app/index.html` (or serve `app/` with any static server) and the
household's money is there.

## What it does

- **Dashboard** — income, spending, what's left, and what's in savings, plus
  a spending-by-category donut, budget progress, recent expenses and bills
  still due.
- **Transactions** — add an expense as it happens, filter by category or
  search, delete a mistake. Every page updates at once.
- **Budgets** — a monthly plan per category with progress bars and
  over/under figures; change any budget and the plan follows.
- **Bills & reminders** — the month's fixed bills with due dates; mark one
  paid and it moves down the list.
- **Goals** — savings goals (emergency fund, vacation, new car) with
  progress and a way to add to each.
- **Insights** — a six-month spending trend, what the numbers mean, and five
  money habits that save real money.
- **Month switcher** — November and October 2026, each with its own figures.

All figures are the household's own: edits are saved in the browser's
localStorage, so the site remembers what was entered and still works with
no network at all.

## Layout

- `app/index.html` — the shell: header, navigation, month picker, footer.
- `app/style.css` — the whole look: warm paper-and-ink palette, system
  fonts, responsive down to a phone.
- `app/data.js` — the household's seed figures (income, expenses, bills,
  goals, six-month trend).
- `app/store.js` — state, localStorage persistence, and the computed
  totals every page reads.
- `app/charts.js` — the SVG donut and bar charts, drawn from the figures.
- `app/views.js` — one render function per page.
- `app/main.js` — the hash router and the event wiring.
- `main.ts` — the entry program: copies `app/` and `screenshots/` to the
  output directory and writes `dossier.json` with the vendored make.fun
  library (`vendor/makefun-frontend.ts`).

## Run it

```sh
node serve.ts            # serves app/ on http://localhost:8080
```

## Build the entry

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Built for the [Make the best household budget site](https://make.fun/c/best-household-budget-site-20261126-1457)
competition on make.fun.
