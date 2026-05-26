const currencyRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 157.3,
  CNY: 7.24,
  CAD: 1.37,
  AUD: 1.51,
  CHF: 0.9,
  SGD: 1.35,
  HKD: 7.82
};

const currencyNames = {
  USD: "USD - US Dollar",
  EUR: "EUR - Euro",
  GBP: "GBP - British Pound",
  JPY: "JPY - Japanese Yen",
  CNY: "CNY - Chinese Yuan",
  CAD: "CAD - Canadian Dollar",
  AUD: "AUD - Australian Dollar",
  CHF: "CHF - Swiss Franc",
  SGD: "SGD - Singapore Dollar",
  HKD: "HKD - Hong Kong Dollar"
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6
});

const byName = (form, name) => form.elements[name];
const numeric = (field) => field ? Number(field.value) || 0 : 0;

function formatMoney(value, code = "USD") {
  const activeCode = code || document.body.dataset.currency || "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: activeCode,
      maximumFractionDigits: activeCode === "JPY" ? 0 : 2
    }).format(value);
  } catch {
    return money.format(value);
  }
}

function setOutput(selector, value) {
  const output = document.querySelector(selector);
  if (output) output.querySelector("strong").textContent = value;
}

function calculateInterest() {
  const form = document.querySelector('[data-calculator="interest"]');
  const principal = numeric(byName(form, "principal"));
  const contribution = numeric(byName(form, "contribution"));
  const rate = numeric(byName(form, "rate")) / 100;
  const years = numeric(byName(form, "years"));
  const frequency = numeric(byName(form, "frequency")) || 1;
  const isSimple = byName(form, "simple").checked;
  const periods = Math.max(years * frequency, 0);
  const periodicRate = frequency ? rate / frequency : 0;
  const periodicContribution = contribution * 12 / frequency;
  const principalGrowth = isSimple
    ? principal * (1 + rate * years)
    : principal * Math.pow(1 + periodicRate, periods);
  const contributionGrowth = isSimple || periodicRate === 0
    ? contribution * 12 * years
    : periodicContribution * ((Math.pow(1 + periodicRate, periods) - 1) / periodicRate);
  const total = principalGrowth + contributionGrowth;
  const contributed = principal + contribution * 12 * years;

  setOutput('[data-result="interest-total"]', formatMoney(total, document.body.dataset.currency));
  setOutput('[data-result="interest-earned"]', formatMoney(total - contributed, document.body.dataset.currency));
  setOutput('[data-result="interest-contributed"]', formatMoney(contributed, document.body.dataset.currency));
}

function calculateMortgage() {
  const form = document.querySelector('[data-calculator="mortgage"]');
  const price = numeric(byName(form, "price"));
  const down = numeric(byName(form, "down"));
  const annualRate = numeric(byName(form, "rate")) / 100;
  const years = numeric(byName(form, "years"));
  const tax = numeric(byName(form, "tax"));
  const insurance = numeric(byName(form, "insurance"));
  const hoa = numeric(byName(form, "hoa"));
  const pmi = numeric(byName(form, "pmi"));
  const closing = numeric(byName(form, "closing"));
  const extraMonthly = numeric(byName(form, "extraMonthly"));
  const extraAnnual = numeric(byName(form, "extraAnnual"));
  const extraOneTime = numeric(byName(form, "extraOneTime"));
  const loan = Math.max(price - down, 0);
  const months = Math.max(years * 12, 1);
  const monthlyRate = annualRate / 12;
  const principalPayment = monthlyRate === 0
    ? loan / months
    : loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const monthlyPmi = loan * (pmi / 100) / 12;
  const monthlyPayment = principalPayment + tax / 12 + insurance / 12 + hoa + monthlyPmi;
  const totalInterest = principalPayment * months - loan;
  const cashToClose = down + closing;
  const schedule = buildAmortizationSchedule({
    loan,
    monthlyRate,
    basePayment: principalPayment,
    maxMonths: months,
    extraMonthly,
    extraAnnual,
    extraOneTime
  });
  const savedInterest = Math.max(totalInterest - schedule.totalInterest, 0);

  setOutput('[data-result="mortgage-payment"]', formatMoney(monthlyPayment, document.body.dataset.currency));
  setOutput('[data-result="mortgage-interest"]', formatMoney(Math.max(totalInterest, 0), document.body.dataset.currency));
  setOutput('[data-result="mortgage-loan"]', formatMoney(loan, document.body.dataset.currency));
  setOutput('[data-result="mortgage-pi"]', formatMoney(principalPayment, document.body.dataset.currency));
  setOutput('[data-result="mortgage-cash"]', formatMoney(cashToClose, document.body.dataset.currency));
  setOutput('[data-result="mortgage-payoff"]', formatDuration(schedule.months));
  setOutput('[data-result="mortgage-saved"]', formatMoney(savedInterest, document.body.dataset.currency));
  renderAmortization(schedule.rows);
}

function buildAmortizationSchedule({ loan, monthlyRate, basePayment, maxMonths, extraMonthly, extraAnnual, extraOneTime }) {
  let balance = loan;
  let totalInterest = 0;
  const rows = [];
  let yearPrincipal = 0;
  let yearInterest = 0;
  let yearExtra = 0;
  let month = 0;

  while (balance > 0.01 && month < maxMonths) {
    month += 1;
    const interest = balance * monthlyRate;
    const scheduledPrincipal = Math.min(Math.max(basePayment - interest, 0), balance);
    const extra = Math.min(
      extraMonthly + (month % 12 === 0 ? extraAnnual : 0) + (month === 1 ? extraOneTime : 0),
      Math.max(balance - scheduledPrincipal, 0)
    );
    const principal = scheduledPrincipal + extra;
    balance = Math.max(balance - principal, 0);
    totalInterest += interest;
    yearPrincipal += principal;
    yearInterest += interest;
    yearExtra += extra;

    if (month % 12 === 0 || balance <= 0.01) {
      rows.push({
        year: Math.ceil(month / 12),
        principal: yearPrincipal,
        interest: yearInterest,
        extra: yearExtra,
        balance
      });
      yearPrincipal = 0;
      yearInterest = 0;
      yearExtra = 0;
    }
  }

  return { months: month, totalInterest, rows };
}

function formatDuration(months) {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (!months) return "0 months";
  if (!years) return `${rest} mo`;
  if (!rest) return `${years} yr`;
  return `${years} yr ${rest} mo`;
}

function renderAmortization(rows) {
  const body = document.querySelector("[data-amortization-body]");
  if (!body) return;

  body.innerHTML = rows.slice(0, 40).map((row) => `
    <tr>
      <td>${row.year}</td>
      <td>${formatMoney(row.principal, document.body.dataset.currency)}</td>
      <td>${formatMoney(row.interest, document.body.dataset.currency)}</td>
      <td>${formatMoney(row.extra, document.body.dataset.currency)}</td>
      <td>${formatMoney(row.balance, document.body.dataset.currency)}</td>
    </tr>
  `).join("");
}

function calculateCurrency() {
  const form = document.querySelector('[data-calculator="currency"]');
  const amount = numeric(byName(form, "amount"));
  const from = byName(form, "from").value;
  const to = byName(form, "to").value;
  const defaultRate = currencyRates[to] / currencyRates[from];
  const override = numeric(byName(form, "rate"));
  const fee = numeric(byName(form, "fee"));
  const spread = numeric(byName(form, "spread")) / 100;
  const rate = override > 0 ? override : defaultRate;
  const gross = amount * rate;
  const total = Math.max(gross * (1 - spread) - fee, 0);

  setOutput('[data-result="currency-total"]', formatMoney(total, to));
  setOutput('[data-result="currency-rate"]', numberFormat.format(rate));
  setOutput('[data-result="currency-cost"]', formatMoney(gross - total, to));
}

function calculateRetirement() {
  const form = document.querySelector('[data-calculator="retirement"]');
  const current = numeric(byName(form, "current"));
  const monthly = numeric(byName(form, "monthly"));
  const annualReturn = numeric(byName(form, "return")) / 100;
  const inflation = numeric(byName(form, "inflation")) / 100;
  const annualIncome = numeric(byName(form, "income"));
  const withdrawal = numeric(byName(form, "withdrawal")) / 100 || 0.04;
  const years = numeric(byName(form, "years"));
  const months = Math.max(years * 12, 0);
  const monthlyReturn = annualReturn / 12;
  const balanceGrowth = current * Math.pow(1 + monthlyReturn, months);
  const contributionGrowth = monthlyReturn === 0
    ? monthly * months
    : monthly * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
  const future = balanceGrowth + contributionGrowth;
  const todayValue = future / Math.pow(1 + inflation, years);
  const totalContributions = current + monthly * months;
  const targetNestEgg = withdrawal > 0 ? annualIncome / withdrawal : 0;
  const gap = targetNestEgg > 0 ? future - targetNestEgg : 0;

  setOutput('[data-result="retirement-future"]', formatMoney(future, document.body.dataset.currency));
  setOutput('[data-result="retirement-today"]', formatMoney(todayValue, document.body.dataset.currency));
  setOutput('[data-result="retirement-contrib"]', formatMoney(totalContributions, document.body.dataset.currency));
  setOutput('[data-result="retirement-target"]', formatMoney(targetNestEgg, document.body.dataset.currency));
  setOutput('[data-result="retirement-gap"]', formatMoney(gap, document.body.dataset.currency));
}

function calculateLoan() {
  const form = document.querySelector('[data-calculator="loan"]');
  const amount = numeric(byName(form, "amount"));
  const rate = numeric(byName(form, "rate")) / 100 / 12;
  const months = Math.max(numeric(byName(form, "years")) * 12, 1);
  const fee = numeric(byName(form, "fee"));
  const payment = rate === 0
    ? amount / months
    : amount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
  const total = payment * months + fee;

  setOutput('[data-result="loan-payment"]', formatMoney(payment, document.body.dataset.currency));
  setOutput('[data-result="loan-interest"]', formatMoney(Math.max(payment * months - amount, 0), document.body.dataset.currency));
  setOutput('[data-result="loan-total"]', formatMoney(total, document.body.dataset.currency));
}

function calculateAutoLoan() {
  const form = document.querySelector('[data-calculator="auto"]');
  const price = numeric(byName(form, "price"));
  const down = numeric(byName(form, "down"));
  const trade = numeric(byName(form, "trade"));
  const tax = numeric(byName(form, "tax")) / 100;
  const fees = numeric(byName(form, "fees"));
  const rate = numeric(byName(form, "rate")) / 100 / 12;
  const months = Math.max(numeric(byName(form, "months")), 1);
  const loan = Math.max(price * (1 + tax) + fees - down - trade, 0);
  const payment = rate === 0
    ? loan / months
    : loan * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);

  setOutput('[data-result="auto-payment"]', formatMoney(payment, document.body.dataset.currency));
  setOutput('[data-result="auto-loan"]', formatMoney(loan, document.body.dataset.currency));
  setOutput('[data-result="auto-interest"]', formatMoney(Math.max(payment * months - loan, 0), document.body.dataset.currency));
}

function calculateCreditCard() {
  const form = document.querySelector('[data-calculator="credit"]');
  const starting = numeric(byName(form, "balance"));
  let balance = starting;
  const apr = numeric(byName(form, "apr")) / 100 / 12;
  const payment = numeric(byName(form, "payment"));
  let months = 0;
  let interest = 0;

  while (balance > 0.01 && months < 600) {
    const monthlyInterest = balance * apr;
    const principal = payment - monthlyInterest;
    if (principal <= 0) break;
    balance = Math.max(balance - principal, 0);
    interest += monthlyInterest;
    months += 1;
  }

  const impossible = balance > 0.01;
  setOutput('[data-result="credit-time"]', impossible ? "Increase payment" : formatDuration(months));
  setOutput('[data-result="credit-interest"]', formatMoney(interest, document.body.dataset.currency));
  setOutput('[data-result="credit-total"]', impossible ? "-" : formatMoney(starting + interest, document.body.dataset.currency));
}

function calculateTax() {
  const form = document.querySelector('[data-calculator="tax"]');
  const amount = numeric(byName(form, "amount"));
  const rate = numeric(byName(form, "rate")) / 100;
  const included = byName(form, "included").checked;
  const tax = included ? amount - amount / (1 + rate) : amount * rate;
  const before = included ? amount - tax : amount;
  const total = included ? amount : amount + tax;

  setOutput('[data-result="tax-before"]', formatMoney(before, document.body.dataset.currency));
  setOutput('[data-result="tax-tax"]', formatMoney(tax, document.body.dataset.currency));
  setOutput('[data-result="tax-total"]', formatMoney(total, document.body.dataset.currency));
}

function calculateSalary() {
  const form = document.querySelector('[data-calculator="salary"]');
  const annual = numeric(byName(form, "annual"));
  const taxRate = numeric(byName(form, "tax")) / 100;
  const retirement = numeric(byName(form, "retirement")) / 100;
  const net = Math.max(annual * (1 - taxRate - retirement), 0);

  setOutput('[data-result="salary-monthly"]', formatMoney(net / 12, document.body.dataset.currency));
  setOutput('[data-result="salary-biweekly"]', formatMoney(net / 26, document.body.dataset.currency));
  setOutput('[data-result="salary-hourly"]', formatMoney(net / 2080, document.body.dataset.currency));
}

function calculateInflation() {
  const form = document.querySelector('[data-calculator="inflation"]');
  const amount = numeric(byName(form, "amount"));
  const rate = numeric(byName(form, "rate")) / 100;
  const years = numeric(byName(form, "years"));
  const future = amount * Math.pow(1 + rate, years);
  const purchasing = amount / Math.pow(1 + rate, years);

  setOutput('[data-result="inflation-future"]', formatMoney(future, document.body.dataset.currency));
  setOutput('[data-result="inflation-power"]', formatMoney(purchasing, document.body.dataset.currency));
  setOutput('[data-result="inflation-loss"]', formatMoney(Math.max(amount - purchasing, 0), document.body.dataset.currency));
}

function populateCurrencies() {
  const currencyForm = document.querySelector('[data-calculator="currency"]');
  if (!currencyForm) return;

  currencyForm.querySelectorAll("select").forEach((select) => {
    Object.entries(currencyNames).forEach(([code, label]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = label;
      select.append(option);
    });
  });

  byName(currencyForm, "from").value = "USD";
  byName(currencyForm, "to").value = "EUR";
}

function bindTabs() {
  const tabs = document.querySelectorAll(".tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.target;

      tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      document.querySelectorAll(".calculator-panel").forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });

      history.replaceState(null, "", `#${targetId}`);
    });
  });
}

function bindCalculators() {
  const calculators = {
    interest: calculateInterest,
    mortgage: calculateMortgage,
    currency: calculateCurrency,
    retirement: calculateRetirement,
    loan: calculateLoan,
    auto: calculateAutoLoan,
    credit: calculateCreditCard,
    tax: calculateTax,
    salary: calculateSalary,
    inflation: calculateInflation
  };

  Object.entries(calculators).forEach(([name, calculate]) => {
    const form = document.querySelector(`[data-calculator="${name}"]`);
    if (!form) return;

    form.addEventListener("input", calculate);
    form.addEventListener("change", calculate);
    calculate();
  });
}

function activateHashTab() {
  const id = window.location.hash.replace("#", "");
  const tab = document.querySelector(`.tab[data-target="${id}"]`);
  if (tab) tab.click();
}

populateCurrencies();
bindTabs();
bindCalculators();
activateHashTab();

if (window.lucide) {
  window.lucide.createIcons();
}
