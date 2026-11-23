# Iowa Opioid Settlement Funds by County

Static GitHub Pages site. Search a county to see 2025 funds received, spent, end balance and reported funded activities, plus statewide totals.

- `?fips=19153` or `?county=Polk` links directly to a county.
- Blank figures mean "not reported" (shown separately from a reported $0).
- The CSV's "Total" row is checked against the sum of counties on load (see the browser console).

## Structure
```text
index.html
css/styles.css
js/config.js   # file paths, link back to the county directory
js/common.js   # shared helpers
js/app.js      # search, county view, statewide summary
data/2025OpioidSettlementFundingIowa.csv
```
