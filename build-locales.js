const fs = require("fs");
const path = require("path");

const root = __dirname;
const domain = "https://www.your-domain.com";

const markets = [
  {
    dir: "en-us",
    lang: "en-US",
    name: "United States",
    currency: "USD",
    title: "Financial Calculators for the United States",
    intro: "US-focused calculators for APY growth, monthly mortgage payments, currency conversion costs, and retirement savings.",
    labels: {
      home: "Home",
      tools: "Calculators",
      open: "Open calculator",
      interest: "Interest Calculator",
      mortgage: "Mortgage Calculator",
      exchange: "Exchange Rate Calculator",
      retirement: "Retirement Savings Calculator",
      principal: "Principal",
      contribution: "Monthly contribution",
      rate: "Annual rate (%)",
      years: "Years",
      frequency: "Compound frequency",
      simple: "Use simple interest",
      future: "Future value",
      earned: "Interest earned",
      contributed: "Total contributed",
      price: "Home price",
      down: "Down payment",
      term: "Loan term (years)",
      tax: "Property tax / year",
      insurance: "Insurance / year",
      hoa: "HOA / month",
      pmi: "PMI (% / year)",
      closing: "Closing costs",
      payment: "Monthly payment",
      pi: "Principal & interest",
      totalInterest: "Total interest",
      cash: "Cash to close",
      extraMonthly: "Extra payment / month",
      extraAnnual: "Extra payment / year",
      extraOneTime: "One-time extra payment",
      payoff: "Payoff time",
      saved: "Interest saved",
      amortization: "Amortization schedule",
      amortizationNote: "Year-by-year estimate including extra payments.",
      tableYear: "Year",
      tablePrincipal: "Principal",
      tableInterest: "Interest",
      tableExtra: "Extra",
      tableBalance: "Balance",
      loanDetails: "Loan details",
      taxesFees: "Taxes and fees",
      extraPayments: "Extra payments",
      loan: "Loan amount",
      amount: "Amount",
      from: "From",
      to: "To",
      override: "Rate override",
      fee: "Provider fee",
      spread: "Spread (%)",
      converted: "Converted amount",
      fxCost: "Estimated cost",
      current: "Current savings",
      monthly: "Monthly contribution",
      returns: "Annual return (%)",
      inflation: "Inflation (%)",
      income: "Target retirement income / year",
      withdrawal: "Withdrawal rate (%)",
      today: "Today's value",
      target: "Target nest egg",
      gap: "Gap or surplus"
    },
    defaults: { principal: 10000, contribution: 250, rate: 5, years: 10, price: 450000, down: 90000, mortgageRate: 6.5, tax: 5400, insurance: 1500, hoa: 150, pmi: 0.35, closing: 9000, current: 65000, monthly: 900, returns: 6.5, inflation: 2.8, income: 85000, withdrawal: 4 },
    notes: ["US mortgages often include property tax, homeowners insurance, HOA fees, and sometimes PMI.", "Retirement planning commonly compares 401(k), IRA, taxable savings, Social Security expectations, and healthcare costs."]
  },
  {
    dir: "es-mx",
    lang: "es-MX",
    name: "México",
    currency: "MXN",
    title: "Calculadoras financieras para México",
    intro: "Calculadoras para intereses, crédito hipotecario, tipo de cambio y ahorro para el retiro en el mercado mexicano.",
    labels: {
      home: "Inicio", tools: "Calculadoras", open: "Abrir calculadora", interest: "Calculadora de interés", mortgage: "Calculadora de hipoteca", exchange: "Calculadora de tipo de cambio", retirement: "Calculadora de retiro",
      principal: "Capital inicial", contribution: "Aportación mensual", rate: "Tasa anual (%)", years: "Años", frequency: "Frecuencia de capitalización", simple: "Usar interés simple", future: "Valor futuro", earned: "Interés ganado", contributed: "Total aportado",
      price: "Precio de vivienda", down: "Enganche", term: "Plazo (años)", tax: "Predial / año", insurance: "Seguro / año", hoa: "Mantenimiento / mes", pmi: "Seguro hipotecario (% / año)", closing: "Gastos iniciales", payment: "Pago mensual", pi: "Capital e interés", totalInterest: "Interés total", cash: "Efectivo inicial", loan: "Monto del crédito",
      amount: "Monto", from: "De", to: "A", override: "Tipo de cambio manual", fee: "Comisión", spread: "Margen (%)", converted: "Monto convertido", fxCost: "Costo estimado",
      extraMonthly: "Pago extra / mes", extraAnnual: "Pago extra / año", extraOneTime: "Pago único extra", payoff: "Tiempo para liquidar", saved: "Interés ahorrado", amortization: "Tabla de amortización", amortizationNote: "Estimación anual incluyendo pagos extra.", tableYear: "Año", tablePrincipal: "Capital", tableInterest: "Interés", tableExtra: "Extra", tableBalance: "Saldo",
      loanDetails: "Datos del crédito", taxesFees: "Impuestos y costos", extraPayments: "Pagos extra",
      current: "Ahorro actual", monthly: "Aportación mensual", returns: "Rendimiento anual (%)", inflation: "Inflación (%)", income: "Ingreso objetivo anual", withdrawal: "Tasa de retiro (%)", today: "Valor actual", target: "Meta de capital", gap: "Déficit o excedente"
    },
    defaults: { principal: 100000, contribution: 3000, rate: 9, years: 10, price: 3500000, down: 700000, mortgageRate: 10.5, tax: 9000, insurance: 12000, hoa: 2500, pmi: 0, closing: 140000, current: 450000, monthly: 6000, returns: 7, inflation: 4.2, income: 420000, withdrawal: 4 },
    notes: ["En México conviene considerar CAT, comisión de apertura, seguros, avalúo y gastos notariales.", "Para retiro, compara ahorro personal, AFORE, aportaciones voluntarias e inflación."]
  },
  {
    dir: "de-de",
    lang: "de-DE",
    name: "Deutschland",
    currency: "EUR",
    title: "Finanzrechner für Deutschland",
    intro: "Rechner für Zinseszins, Immobilienfinanzierung, Wechselkurse und Altersvorsorge im deutschen Markt.",
    labels: {
      home: "Start", tools: "Rechner", open: "Rechner öffnen", interest: "Zinsrechner", mortgage: "Baufinanzierungsrechner", exchange: "Währungsrechner", retirement: "Rentenrechner",
      principal: "Startkapital", contribution: "Monatliche Sparrate", rate: "Jahreszins (%)", years: "Jahre", frequency: "Zinsintervall", simple: "Einfachen Zins nutzen", future: "Endwert", earned: "Zinsertrag", contributed: "Einzahlungen gesamt",
      price: "Kaufpreis", down: "Eigenkapital", term: "Laufzeit (Jahre)", tax: "Grundsteuer / Jahr", insurance: "Versicherung / Jahr", hoa: "Hausgeld / Monat", pmi: "Zusatzversicherung (% / Jahr)", closing: "Nebenkosten", payment: "Monatsrate", pi: "Zins und Tilgung", totalInterest: "Zinsen gesamt", cash: "Benötigtes Kapital", loan: "Darlehensbetrag",
      amount: "Betrag", from: "Von", to: "Nach", override: "Eigener Kurs", fee: "Gebühr", spread: "Aufschlag (%)", converted: "Umgerechneter Betrag", fxCost: "Geschätzte Kosten",
      extraMonthly: "Sonderzahlung / Monat", extraAnnual: "Sonderzahlung / Jahr", extraOneTime: "Einmalige Sonderzahlung", payoff: "Tilgungsdauer", saved: "Gesparte Zinsen", amortization: "Tilgungsplan", amortizationNote: "Jährliche Schätzung inklusive Sonderzahlungen.", tableYear: "Jahr", tablePrincipal: "Tilgung", tableInterest: "Zinsen", tableExtra: "Extra", tableBalance: "Restschuld",
      loanDetails: "Darlehensdaten", taxesFees: "Steuern und Kosten", extraPayments: "Sonderzahlungen",
      current: "Aktuelles Vermögen", monthly: "Monatliche Sparrate", returns: "Rendite p.a. (%)", inflation: "Inflation (%)", income: "Ziel-Einkommen / Jahr", withdrawal: "Entnahmerate (%)", today: "Heutiger Wert", target: "Zielvermögen", gap: "Lücke oder Überschuss"
    },
    defaults: { principal: 10000, contribution: 300, rate: 3.5, years: 12, price: 520000, down: 104000, mortgageRate: 3.8, tax: 900, insurance: 700, hoa: 280, pmi: 0, closing: 52000, current: 50000, monthly: 600, returns: 5, inflation: 2.2, income: 48000, withdrawal: 3.5 },
    notes: ["In Deutschland sind Kaufnebenkosten wie Grunderwerbsteuer, Notar und Makler besonders wichtig.", "Altersvorsorge sollte gesetzliche Rente, betriebliche Vorsorge und private Anlagen getrennt betrachten."]
  },
  {
    dir: "ja-jp",
    lang: "ja-JP",
    name: "日本",
    currency: "JPY",
    title: "日本向け金融計算機",
    intro: "日本市場向けの利息、住宅ローン、為替、老後資金シミュレーターです。",
    labels: {
      home: "ホーム", tools: "計算機", open: "計算する", interest: "利息計算機", mortgage: "住宅ローン計算機", exchange: "為替計算機", retirement: "老後資金計算機",
      principal: "元本", contribution: "毎月積立額", rate: "年利 (%)", years: "年数", frequency: "複利頻度", simple: "単利で計算", future: "将来価値", earned: "利息", contributed: "拠出合計",
      price: "物件価格", down: "頭金", term: "返済期間（年）", tax: "固定資産税 / 年", insurance: "保険料 / 年", hoa: "管理費 / 月", pmi: "保証料率 (% / 年)", closing: "諸費用", payment: "月々返済額", pi: "元利返済", totalInterest: "利息総額", cash: "初期費用", loan: "借入額",
      amount: "金額", from: "変換元", to: "変換先", override: "為替レート入力", fee: "手数料", spread: "スプレッド (%)", converted: "換算額", fxCost: "推定コスト",
      extraMonthly: "毎月の追加返済", extraAnnual: "毎年の追加返済", extraOneTime: "一回限りの追加返済", payoff: "完済期間", saved: "節約利息", amortization: "返済予定表", amortizationNote: "追加返済を含む年次シミュレーションです。", tableYear: "年", tablePrincipal: "元金", tableInterest: "利息", tableExtra: "追加", tableBalance: "残高",
      loanDetails: "ローン条件", taxesFees: "税金と費用", extraPayments: "追加返済",
      current: "現在の貯蓄", monthly: "毎月積立額", returns: "年リターン (%)", inflation: "インフレ率 (%)", income: "目標年収", withdrawal: "取り崩し率 (%)", today: "現在価値", target: "目標資産", gap: "不足または余剰"
    },
    defaults: { principal: 1000000, contribution: 30000, rate: 3, years: 15, price: 52000000, down: 10000000, mortgageRate: 1.2, tax: 160000, insurance: 80000, hoa: 18000, pmi: 0, closing: 2500000, current: 6000000, monthly: 80000, returns: 4, inflation: 1.5, income: 4200000, withdrawal: 3.5 },
    notes: ["日本の住宅ローンでは変動金利、固定金利、団信、保証料、管理費を分けて確認すると比較しやすくなります。", "老後資金は公的年金、iDeCo、NISA、生活費、医療費を分けて考えると現実的です。"]
  },
  {
    dir: "fr-fr",
    lang: "fr-FR",
    name: "France",
    currency: "EUR",
    title: "Calculatrices financières pour la France",
    intro: "Outils pour intérêts composés, prêt immobilier, conversion de devises et épargne retraite adaptés au marché français.",
    labels: {
      home: "Accueil", tools: "Calculatrices", open: "Ouvrir", interest: "Calculatrice d'intérêts", mortgage: "Calculatrice de prêt immobilier", exchange: "Calculatrice de change", retirement: "Calculatrice retraite",
      principal: "Capital initial", contribution: "Versement mensuel", rate: "Taux annuel (%)", years: "Années", frequency: "Fréquence de capitalisation", simple: "Utiliser l'intérêt simple", future: "Valeur future", earned: "Intérêts gagnés", contributed: "Total versé",
      price: "Prix du bien", down: "Apport", term: "Durée (années)", tax: "Taxe foncière / an", insurance: "Assurance / an", hoa: "Charges / mois", pmi: "Assurance emprunteur (% / an)", closing: "Frais d'achat", payment: "Mensualité", pi: "Capital et intérêts", totalInterest: "Intérêts totaux", cash: "Apport total requis", loan: "Montant emprunté",
      amount: "Montant", from: "De", to: "Vers", override: "Taux manuel", fee: "Frais", spread: "Marge (%)", converted: "Montant converti", fxCost: "Coût estimé",
      extraMonthly: "Paiement extra / mois", extraAnnual: "Paiement extra / an", extraOneTime: "Paiement extra unique", payoff: "Durée de remboursement", saved: "Intérêts économisés", amortization: "Tableau d'amortissement", amortizationNote: "Estimation annuelle avec paiements supplémentaires.", tableYear: "Année", tablePrincipal: "Capital", tableInterest: "Intérêts", tableExtra: "Extra", tableBalance: "Solde",
      loanDetails: "Détails du prêt", taxesFees: "Taxes et frais", extraPayments: "Paiements supplémentaires",
      current: "Épargne actuelle", monthly: "Versement mensuel", returns: "Rendement annuel (%)", inflation: "Inflation (%)", income: "Revenu retraite cible / an", withdrawal: "Taux de retrait (%)", today: "Valeur actuelle", target: "Capital cible", gap: "Écart ou surplus"
    },
    defaults: { principal: 10000, contribution: 250, rate: 4, years: 12, price: 360000, down: 72000, mortgageRate: 3.6, tax: 1400, insurance: 1200, hoa: 180, pmi: 0.3, closing: 28000, current: 45000, monthly: 500, returns: 4.8, inflation: 2, income: 42000, withdrawal: 3.7 },
    notes: ["En France, comparez TAEG, assurance emprunteur, frais de notaire, taxe foncière et charges de copropriété.", "Pour la retraite, distinguez pension estimée, épargne personnelle, assurance vie, PER et pouvoir d'achat."]
  }
];

const calcMeta = [
  ["interest", "percent"],
  ["mortgage", "home"],
  ["exchange", "repeat-2"],
  ["retirement", "piggy-bank"]
];

function relPrefix(market) {
  return market ? "../" : "";
}

function head({ lang, title, description, canonical }) {
  const links = markets.map((m) => `    <link rel="alternate" hreflang="${m.lang}" href="${domain}/${m.dir}/">`).join("\n");
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="../assets/financial-calculators-hero.png">
    <link rel="icon" href="../assets/favicon.ico" sizes="any">
    <link rel="icon" href="../assets/logo.svg" type="image/svg+xml">
    <link rel="canonical" href="${canonical}">
${links}
    <link rel="stylesheet" href="../styles.css">
  </head>`;
}

function header(market, active) {
  const l = market.labels;
  return `<body data-currency="${market.currency}">
    <header class="site-header">
      <a class="brand" href="index.html"><img class="brand-logo" src="../assets/logo.svg" alt="Financial Calculators"></a>
      <nav class="nav" aria-label="Primary navigation">
        <a ${active === "home" ? 'aria-current="page"' : ""} href="index.html">${l.home}</a>
        ${calcMeta.map(([key]) => `<a ${active === key ? 'aria-current="page"' : ""} href="${key}-calculator.html">${l[key]}</a>`).join("\n        ")}
      </nav>
    </header>`;
}

function footer(market) {
  return `    <footer class="site-footer"><span>Financial Calculators</span><span>${market.name}</span></footer>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
    <script src="../script.js"></script>
  </body>
</html>`;
}

function homePage(market) {
  const l = market.labels;
  return `${head({ lang: market.lang, title: market.title, description: market.intro, canonical: `${domain}/${market.dir}/` })}
  ${header(market, "home")}
    <main>
      <section class="page-hero">
        <p class="eyebrow dark">${market.name}</p>
        <h1>${market.title}</h1>
        <p>${market.intro}</p>
      </section>
      <section class="home-tools market-home" aria-labelledby="tools-title">
        <div class="section-head"><p class="eyebrow dark">${l.tools}</p><h2 id="tools-title">${l.tools} - ${market.name}</h2></div>
        <div class="tool-cards">
          ${calcMeta.map(([key, icon]) => `<a class="tool-card" href="${key}-calculator.html"><i data-lucide="${icon}"></i><h3>${l[key]}</h3><p>${market.notes[key === "mortgage" ? 0 : 1] || market.intro}</p><span>${l.open}</span></a>`).join("\n          ")}
        </div>
      </section>
      <section class="content-band"><div class="content-grid"><div><p class="eyebrow dark">Market notes</p><h2>${market.name} planning assumptions</h2></div><div class="copy-stack">${market.notes.map((n) => `<p>${n}</p>`).join("")}<p>All results are estimates for comparison and education, not financial advice.</p></div></div></section>
    </main>
${footer(market)}`;
}

function formFields(type, m) {
  const l = m.labels, d = m.defaults;
  if (type === "interest") return `
            <label>${l.principal}<input name="principal" type="number" value="${d.principal}" min="0" step="0.01"></label>
            <label>${l.contribution}<input name="contribution" type="number" value="${d.contribution}" min="0" step="0.01"></label>
            <label>${l.rate}<input name="rate" type="number" value="${d.rate}" step="0.01"></label>
            <label>${l.years}<input name="years" type="number" value="${d.years}" min="0" step="0.5"></label>
            <label>${l.frequency}<select name="frequency"><option value="1">Annual</option><option value="4">Quarterly</option><option value="12" selected>Monthly</option><option value="365">Daily</option></select></label>
            <label class="check-row"><input name="simple" type="checkbox">${l.simple}</label>`;
  if (type === "mortgage") return `
            <div class="form-section-title">${l.loanDetails}</div>
            <label>${l.price}<input name="price" type="number" value="${d.price}" min="0" step="1000"></label>
            <label>${l.down}<input name="down" type="number" value="${d.down}" min="0" step="1000"></label>
            <label>${l.rate}<input name="rate" type="number" value="${d.mortgageRate}" step="0.01"></label>
            <label>${l.term}<input name="years" type="number" value="30" min="1" step="1"></label>
            <div class="form-section-title">${l.taxesFees}</div>
            <label>${l.tax}<input name="tax" type="number" value="${d.tax}" min="0" step="100"></label>
            <label>${l.insurance}<input name="insurance" type="number" value="${d.insurance}" min="0" step="100"></label>
            <label>${l.hoa}<input name="hoa" type="number" value="${d.hoa}" min="0" step="10"></label>
            <label>${l.pmi}<input name="pmi" type="number" value="${d.pmi}" min="0" step="0.01"></label>
            <label>${l.closing}<input name="closing" type="number" value="${d.closing}" min="0" step="100"></label>
            <div class="form-section-title">${l.extraPayments}</div>
            <label>${l.extraMonthly}<input name="extraMonthly" type="number" value="0" min="0" step="50"></label>
            <label>${l.extraAnnual}<input name="extraAnnual" type="number" value="0" min="0" step="100"></label>
            <label>${l.extraOneTime}<input name="extraOneTime" type="number" value="0" min="0" step="100"></label>`;
  if (type === "exchange") return `
            <label>${l.amount}<input name="amount" type="number" value="1000" min="0" step="0.01"></label>
            <label>${l.from}<select name="from"></select></label>
            <label>${l.to}<select name="to"></select></label>
            <label>${l.override}<input name="rate" type="number" min="0" step="0.000001"></label>
            <label>${l.fee}<input name="fee" type="number" value="0" min="0" step="0.01"></label>
            <label>${l.spread}<input name="spread" type="number" value="0.5" min="0" step="0.01"></label>
            <p class="field-note">Use a live quote for exact execution. Built-in rates are planning examples.</p>`;
  return `
            <label>${l.current}<input name="current" type="number" value="${d.current}" min="0" step="100"></label>
            <label>${l.monthly}<input name="monthly" type="number" value="${d.monthly}" min="0" step="50"></label>
            <label>${l.returns}<input name="return" type="number" value="${d.returns}" step="0.01"></label>
            <label>${l.years}<input name="years" type="number" value="${d.years}" min="0" step="1"></label>
            <label>${l.inflation}<input name="inflation" type="number" value="${d.inflation}" step="0.01"></label>
            <label>${l.income}<input name="income" type="number" value="${d.income}" min="0" step="100"></label>
            <label>${l.withdrawal}<input name="withdrawal" type="number" value="${d.withdrawal}" min="0.1" step="0.1"></label>`;
}

function outputs(type, l) {
  const map = {
    interest: [["interest-total", l.future], ["interest-earned", l.earned], ["interest-contributed", l.contributed]],
    mortgage: [["mortgage-payment", l.payment], ["mortgage-pi", l.pi], ["mortgage-interest", l.totalInterest], ["mortgage-loan", l.loan], ["mortgage-cash", l.cash], ["mortgage-payoff", l.payoff], ["mortgage-saved", l.saved]],
    exchange: [["currency-total", l.converted], ["currency-rate", "Rate"], ["currency-cost", l.fxCost]],
    retirement: [["retirement-future", l.future], ["retirement-today", l.today], ["retirement-contrib", l.contributed], ["retirement-target", l.target], ["retirement-gap", l.gap]]
  };
  return map[type].map(([key, label], i) => `<output class="result-card ${i === 1 ? "accent" : i === 2 ? "muted" : ""}" data-result="${key}"><span>${label}</span><strong>$0</strong></output>`).join("\n            ");
}

function calcPage(market, type) {
  const l = market.labels;
  const title = `${l[type]} | ${market.name}`;
  const desc = `${l[type]} for ${market.name}: detailed local-market inputs, estimates, and planning notes.`;
  const dataType = type === "exchange" ? "currency" : type;
  return `${head({ lang: market.lang, title, description: desc, canonical: `${domain}/${market.dir}/${type}-calculator.html` })}
  ${header(market, type)}
    <main>
      <section class="page-hero">
        <p class="eyebrow dark">${market.name}</p>
        <h1>${l[type]}</h1>
        <p>${desc}</p>
      </section>
      <section class="calculator-layout">
        <article class="tool-shell standalone">
          <div class="panel-head"><div><h2>${l[type]}</h2><p>${market.intro}</p></div></div>
          <form class="calculator-grid" data-calculator="${dataType}">
${formFields(type, market)}
          </form>
          <div class="result-grid" aria-live="polite">
            ${outputs(type, l)}
          </div>
        </article>
        <aside class="side-panel"><h2>${market.name}</h2>${market.notes.map((n) => `<p>${n}</p>`).join("")}</aside>
      </section>
      ${type === "mortgage" ? `<section class="amortization-section"><div class="amortization-head"><h2>${l.amortization}</h2><p>${l.amortizationNote}</p></div><div class="table-wrap"><table class="amortization-table"><thead><tr><th>${l.tableYear}</th><th>${l.tablePrincipal}</th><th>${l.tableInterest}</th><th>${l.tableExtra}</th><th>${l.tableBalance}</th></tr></thead><tbody data-amortization-body></tbody></table></div></section>` : ""}
      <section class="article-section">
        <h2>${l[type]} guide</h2>
        <p>Adjust each input to compare realistic scenarios for ${market.name}. Keep fees, taxes, inflation, provider charges, and local rules separate when possible.</p>
        <h2>Important limitation</h2>
        <p>This calculator is designed for planning and SEO content coverage. It does not replace licensed financial, tax, mortgage, or investment advice.</p>
        <div class="related-links">${calcMeta.filter(([k]) => k !== type).map(([k]) => `<a href="${k}-calculator.html">${l[k]}</a>`).join("")}</div>
      </section>
    </main>
${footer(market)}`;
}

for (const market of markets) {
  const outDir = path.join(root, market.dir);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), homePage(market));
  for (const [type] of calcMeta) {
    fs.writeFileSync(path.join(outDir, `${type}-calculator.html`), calcPage(market, type));
  }
}

const urls = [`${domain}/`, ...markets.flatMap((m) => [
  `${domain}/${m.dir}/`,
  ...calcMeta.map(([type]) => `${domain}/${m.dir}/${type}-calculator.html`)
])];
fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc><changefreq>monthly</changefreq><priority>${url.endsWith("/") ? "0.9" : "0.8"}</priority></url>`).join("\n")}\n</urlset>\n`);
