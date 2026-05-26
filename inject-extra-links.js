const fs = require("fs");
const path = require("path");

const root = __dirname;
const markets = ["en-us", "es-mx", "de-de", "ja-jp", "fr-fr"];
const links = [
  ["loan-calculator.html", "Loan Calculator"],
  ["auto-calculator.html", "Auto Loan Calculator"],
  ["credit-card-payoff-calculator.html", "Credit Card Payoff"],
  ["tax-calculator.html", "Tax Calculator"],
  ["salary-calculator.html", "Salary Calculator"],
  ["inflation-calculator.html", "Inflation Calculator"]
];

for (const market of markets) {
  const file = path.join(root, market, "index.html");
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("More calculators")) continue;
  const block = `
      <section class="market-section" aria-labelledby="more-calculators">
        <div class="section-head"><p class="eyebrow dark">More tools</p><h2 id="more-calculators">More calculators</h2></div>
        <div class="market-grid">
          ${links.map(([href, label]) => `<a href="${href}"><strong>${label}</strong><span>Open a quick calculator for common everyday finance questions.</span></a>`).join("\n          ")}
        </div>
      </section>`;
  html = html.replace("      <section class=\"content-band\">", `${block}\n      <section class=\"content-band\">`);
  fs.writeFileSync(file, html);
}
