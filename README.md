# Iowa Opioid Settlement Funds by County

An independent, static GitHub Pages project that organizes selected information from Iowa counties’ 2025 **Opioid Funds – Public Annual Report** submissions. It lets visitors search by county or city, view reported county-level fund receipts, expenditures and balances, review reported funded activities, and compare selected figures on a county map.

This project is an independent public-information resource. It is not an official State of Iowa or Iowa Attorney General website, and it is not sponsored, approved, or endorsed by the State, the Attorney General, any participating local government, or any settlement administrator.

## Primary sources

The funding information is compiled from county submissions of the Iowa **Opioid Funds – Public Annual Report** for state fiscal year 2025.

- **Public copies used to identify source reports:** [DocumentCloud search tagged `OSF-IA-2025`](https://www.documentcloud.org/documents/?q=+%2Bdata__tag%3A%22OSF-IA-2025%22)
- **Iowa Attorney General opioid settlement information and report form:** [Iowa Attorney General – Opioid Settlement Information](https://www.iowaattorneygeneral.gov/news/opioid-settlement-information)
- **Governing allocation agreement:** [Iowa Opioid Allocation Memorandum of Understanding (MOU)](https://www.iowaattorneygeneral.gov/news/opioid-settlement-information/iowa-memorandum-of-understanding)
- **Blank form used as a reference:** `Opioid Funds – Public Annual Report` (Version 1, April 2023), supplied with the project materials.

The Iowa Attorney General describes the MOU as the agreement governing allocation of settlement funds among Iowa counties and eligible cities for the Distributors and Johnson & Johnson/Janssen settlements. The Attorney General’s opioid settlement page links to the Public Annual Report form.

## What the annual report contains

The blank Public Annual Report states that it is to be completed by entities required to report under Paragraph C(4) of the MOU, for each state fiscal year, and that Section 1 is completed using a **cash-basis approach**.

The form requests, among other items:

- The reporting state fiscal year and participating local government.
- Beginning abatement-fund account balance.
- Abatement funds received during the reporting year.
- Abatement-fund expenditures during the reporting year.
- Ending abatement-fund account balance.
- For each funded activity, the MOU remediation-use section, amount expended, a brief activity description, and reported progress and/or outcomes.

The form says reports are due December 1 following the end of the reporting year. It also contains a certification for the submitting official concerning the truth and correctness of the information and consistency of expenditures with the Iowa MOU. That certification is made by the submitting entity—not by this website.

## Scope and methodology

- The funding dataset is intended to represent **county-reported information for state fiscal year 2025**.
- The site presents selected fields extracted using Tesseract OCR, reviewed as described below, and organized from the county annual reports. It is a secondary compilation, not the original reports.
- The project does **not** include separate city-level or state-level opioid settlement funds.
- City names in the search interface are geographic lookup aids based on the population file. Selecting a city takes the visitor to the associated county’s funding record. It does not mean the city received the county’s funds or that the displayed figures are city-specific.
- Population figures come from `data/IACityCountyPopulation2024.csv` and are used for city search and per-resident calculations. They are not sourced from the opioid settlement annual report.
- County boundaries come from `County.geojson`.
- Blank or unavailable financial values are treated as **not reported**, not as zero.
- Statewide totals are calculated from available reported values. A statewide total should be read together with its reporting coverage; it may not represent all 99 counties if some values are missing.
- Per-resident measures combine reported FY2025 county spending with 2024 population estimates. They are descriptive calculations, not figures reported on the annual-report form.
- A spending-to-receipts percentage may exceed 100% when a county spends funds carried forward from a prior reporting year.

### PDF text extraction and transcription review

Tesseract OCR (optical character recognition) was used to extract text from the source PDF reports. For the funded-activities section, the extracted text was copied into Microsoft Word and reviewed to identify and correct apparent OCR or transcription errors before being included in the compiled dataset. The resulting text was then organized and formatted for this website.

This was a quality-control step, not an independent audit or a guarantee of perfect transcription. OCR may misread characters, numbers, line breaks, tables, or text in low-quality scans, and manual proofreading may not identify every error. Where exact wording, a figure, or the context of an activity is important, readers should consult the original county PDF report.

The source documents and transcription process may contain omissions, inconsistencies, ambiguous entries, or errors. The project may normalize formatting and organize reported information for comparison, but it does not independently establish facts absent from the source reports.

## Important limitations and disclaimer

**No independent audit or verification.** Figures and activity descriptions are attributed to the reporting local governments and are presented as reported. This project does not independently audit or verify the source reports, bank balances, receipts, expenditures, supporting documentation, the eligibility of expenditures under the MOU, or the accuracy or effectiveness of reported activities and outcomes.

**No determination of compliance.** A local government’s report may contain a certification concerning its submission and expenditures. That certification is the responsibility of the submitting official. Inclusion in this website does not mean that this project has determined that an expenditure complies with the MOU, applicable law, or any settlement requirement.

**Not a complete accounting of Iowa settlement funds.** The site covers the county-level reporting included in this dataset. It is not a complete accounting of all settlement funds allocated, received, or spent by Iowa local governments or the State of Iowa. Separate city-level and state-level funds are outside the current scope.

**No government affiliation or endorsement.** This is an independent informational project. It is not operated by, affiliated with, sponsored by, approved by, or endorsed by the State of Iowa, the Iowa Attorney General, any county or city, or any settlement administrator. References to public agencies, reports, and settlement documents identify source material only.

**No professional advice; no warranty.** The site is provided for general informational and transparency purposes. It is not legal, accounting, financial, or audit advice. The data and website are provided “as is,” without a representation or warranty that the information is complete, current, error-free, or suitable for a particular purpose, to the extent permitted by applicable law. Users should consult the original report, the applicable MOU, and the responsible government office before relying on a figure or drawing a conclusion.

If a displayed value differs from an original report or official record, the original report or official record should be consulted. Questions about a county’s submission should be directed to that county. Questions about the state reporting form or MOU may be directed to the Iowa Attorney General through its [opioid settlement information page](https://www.iowaattorneygeneral.gov/news/opioid-settlement-information).

## Data files

- `data/2025OpioidSettlementFundingIowa.csv` — compiled county-level FY2025 financial and activity information.
- `data/IACityCountyPopulation2024.csv` — 2024 city/county population estimates used for search and per-resident calculations.
- `County.geojson` — Iowa county boundaries used by the map.

## Application structure

```text
index.html
css/
  styles.css
js/
  config.js
  common.js
  app.js
  map.js
data/
  2025OpioidSettlementFundingIowa.csv
  IACityCountyPopulation2024.csv
County.geojson
README.md
```

## Running and deploying

This is a static site intended for GitHub Pages. The application loads CSV data with Papa Parse and displays county boundaries with Leaflet. Because it fetches local CSV and GeoJSON files, test it through a local web server or GitHub Pages rather than opening `index.html` directly as a `file://` URL.

County links can be shared directly:

- `?fips=19153`
- `?county=Polk`

The browser console reports data-loading and county-map matching diagnostics.
