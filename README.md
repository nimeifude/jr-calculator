# Financial Calculators

Static English website for global SEO traffic:

- Interest Calculator
- Mortgage Calculator
- Exchange Rate Calculator
- Retirement Savings Calculator
- Loan Calculator
- Auto Loan Calculator
- Credit Card Payoff Calculator
- Tax Calculator
- Salary Calculator
- Inflation Calculator

Each calculator has its own SEO-friendly page, plus a homepage that links to all tools.

## Localized Markets

The site now includes five localized market folders:

- `en-us/` - United States, English
- `es-mx/` - Mexico, Spanish
- `de-de/` - Germany, German
- `ja-jp/` - Japan, Japanese
- `fr-fr/` - France, French

Each market folder contains a local homepage plus separate calculator pages for interest, mortgage, exchange, retirement, loan, auto loan, credit card payoff, tax, salary, and inflation.

## Local Preview

```powershell
py -m http.server 5499 --bind 127.0.0.1
```

Open `http://127.0.0.1:5499/`.

## Before Deploying

Replace the placeholder sitemap URL in `sitemap.xml` and the `Sitemap` value in `robots.txt` with the production domain.

## Design Notes

- `assets/logo.svg` is the primary site logo.
- `assets/favicon.ico` is linked from page titles/browser tabs.
- Mortgage pages include extra payments and a yearly amortization schedule inspired by common mortgage calculator workflows.
