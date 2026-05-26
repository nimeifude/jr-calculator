const fs = require("fs");
const path = require("path");

const root = __dirname;
const domain = "https://www.your-domain.com";

const markets = [
  { dir: "en-us", lang: "en-US", name: "United States", currency: "USD" },
  { dir: "es-mx", lang: "es-MX", name: "México", currency: "MXN" },
  { dir: "de-de", lang: "de-DE", name: "Deutschland", currency: "EUR" },
  { dir: "ja-jp", lang: "ja-JP", name: "日本", currency: "JPY" },
  { dir: "fr-fr", lang: "fr-FR", name: "France", currency: "EUR" }
];

const extras = [
  {
    slug: "loan",
    data: "loan",
    icon: "circle-dollar-sign",
    title: "Loan Calculator",
    desc: "Estimate monthly loan payments, total interest, and total repayment cost.",
    fields: [
      ["Loan amount", "amount", 25000],
      ["Annual rate (%)", "rate", 8.5],
      ["Years", "years", 5],
      ["Origination fee", "fee", 250]
    ],
    results: [["loan-payment", "Monthly payment"], ["loan-interest", "Total interest"], ["loan-total", "Total cost"]]
  },
  {
    slug: "auto",
    data: "auto",
    icon: "car",
    title: "Auto Loan Calculator",
    desc: "Estimate car loan payments including down payment, trade-in value, tax, and fees.",
    fields: [
      ["Car price", "price", 35000],
      ["Down payment", "down", 5000],
      ["Trade-in value", "trade", 2000],
      ["Sales tax (%)", "tax", 7],
      ["Fees", "fees", 600],
      ["Annual rate (%)", "rate", 7.5],
      ["Months", "months", 60]
    ],
    results: [["auto-payment", "Monthly payment"], ["auto-loan", "Amount financed"], ["auto-interest", "Total interest"]]
  },
  {
    slug: "credit-card-payoff",
    data: "credit",
    icon: "credit-card",
    title: "Credit Card Payoff Calculator",
    desc: "Estimate how long it takes to pay off a credit card balance and how much interest you may pay.",
    fields: [
      ["Card balance", "balance", 6000],
      ["APR (%)", "apr", 22],
      ["Monthly payment", "payment", 300]
    ],
    results: [["credit-time", "Payoff time"], ["credit-interest", "Total interest"], ["credit-total", "Total paid"]]
  },
  {
    slug: "tax",
    data: "tax",
    icon: "receipt",
    title: "Tax Calculator",
    desc: "Add or remove sales tax, VAT, GST, or consumption tax from an amount.",
    fields: [
      ["Amount", "amount", 1000],
      ["Tax rate (%)", "rate", 8.25]
    ],
    checkbox: ["Amount includes tax", "included"],
    results: [["tax-before", "Before tax"], ["tax-tax", "Tax amount"], ["tax-total", "Total"]]
  },
  {
    slug: "salary",
    data: "salary",
    icon: "briefcase-business",
    title: "Salary Calculator",
    desc: "Estimate net monthly, biweekly, and hourly pay from annual salary assumptions.",
    fields: [
      ["Gross annual salary", "annual", 85000],
      ["Estimated tax (%)", "tax", 24],
      ["Retirement contribution (%)", "retirement", 5]
    ],
    results: [["salary-monthly", "Net monthly"], ["salary-biweekly", "Net biweekly"], ["salary-hourly", "Net hourly"]]
  },
  {
    slug: "inflation",
    data: "inflation",
    icon: "trending-up",
    title: "Inflation Calculator",
    desc: "Estimate future prices and purchasing power after inflation.",
    fields: [
      ["Amount", "amount", 1000],
      ["Inflation rate (%)", "rate", 3],
      ["Years", "years", 10]
    ],
    results: [["inflation-future", "Future cost"], ["inflation-power", "Buying power"], ["inflation-loss", "Value lost"]]
  }
];

function shell(market, calc) {
  return `<!doctype html>
<html lang="${market.lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${calc.title} | ${market.name}</title>
    <meta name="description" content="${calc.desc}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="icon" href="../assets/favicon.ico" sizes="any">
    <link rel="icon" href="../assets/logo.svg" type="image/svg+xml">
    <link rel="canonical" href="${domain}/${market.dir}/${calc.slug}-calculator.html">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body data-currency="${market.currency}">
    <header class="site-header">
      <a class="brand" href="index.html"><img class="brand-logo" src="../assets/logo.svg" alt="Financial Calculators"></a>
      <nav class="nav" aria-label="Primary navigation">
        <a href="index.html">Home</a>
        <a href="mortgage-calculator.html">Mortgage</a>
        <a href="interest-calculator.html">Interest</a>
        <a aria-current="page" href="${calc.slug}-calculator.html">${calc.title.replace(" Calculator", "")}</a>
      </nav>
    </header>
    <main>
      <section class="page-hero">
        <p class="eyebrow dark">${market.name}</p>
        <h1>${calc.title}</h1>
        <p>${calc.desc}</p>
      </section>
      <section class="calculator-layout">
        <article class="tool-shell standalone">
          <div class="panel-head"><div><h2>${calc.title}</h2><p>Enter your assumptions and compare the estimate instantly.</p></div></div>
          <form class="calculator-grid" data-calculator="${calc.data}">
            ${calc.fields.map(([label, name, value]) => `<label>${label}<input name="${name}" type="number" value="${value}" step="0.01"></label>`).join("\n            ")}
            ${calc.checkbox ? `<label class="check-row"><input name="${calc.checkbox[1]}" type="checkbox">${calc.checkbox[0]}</label>` : ""}
          </form>
          <div class="result-grid" aria-live="polite">
            ${calc.results.map(([key, label], index) => `<output class="result-card ${index === 1 ? "accent" : index === 2 ? "muted" : ""}" data-result="${key}"><span>${label}</span><strong>$0</strong></output>`).join("\n            ")}
          </div>
        </article>
        <aside class="side-panel"><h2>${market.name}</h2><p>This calculator is a planning estimate. Local taxes, fees, lender rules, inflation, and provider terms can change the real result.</p><p>Use it to compare scenarios before making a financial decision.</p></aside>
      </section>
      <section class="article-section">
        <h2>How to use this calculator</h2>
        <p>Adjust the inputs and review the result cards. For precise quotes, compare the estimate with local rules, providers, and professional advice.</p>
        <div class="related-links"><a href="mortgage-calculator.html">Mortgage Calculator</a><a href="interest-calculator.html">Interest Calculator</a><a href="retirement-calculator.html">Retirement Calculator</a></div>
      </section>
    </main>
    <footer class="site-footer"><span>Financial Calculators</span><span>${market.name}</span></footer>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
    <script src="../script.js"></script>
  </body>
</html>`;
}

for (const market of markets) {
  for (const calc of extras) {
    fs.writeFileSync(path.join(root, market.dir, `${calc.slug}-calculator.html`), shell(market, calc));
  }
}

const sitemapPath = path.join(root, "sitemap.xml");
const existing = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";
const urls = new Set([...existing.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));
for (const market of markets) {
  for (const calc of extras) urls.add(`${domain}/${market.dir}/${calc.slug}-calculator.html`);
}
fs.writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].map((url) => `  <url><loc>${url}</loc><changefreq>monthly</changefreq><priority>0.75</priority></url>`).join("\n")}\n</urlset>\n`);
