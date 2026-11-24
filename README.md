# Iowa Opioid Settlement Funds by County

An independent, static GitHub Pages project that organizes selected information from Iowa counties’ 2025 **Opioid Funds – Public Annual Report** submissions to let visitors search by county or city, view reported county-level fund receipts, expenditures and balances, review reported funded activities, and compare selected figures on a county map.

This project is an independent public-information resource. It is not an official State of Iowa or Iowa Attorney General website, and it is not sponsored, approved, or endorsed by the State, the Attorney General, any participating local government, or any settlement administrator.

## Primary sources

The funding information is compiled from county submissions of the Iowa Opioid Funds – Public Annual Report for state fiscal year 2025.

- **Public copies of these reports are available from the Iowa Attorney General at OpioidSettlement@ag.iowa.gov or at this link:** [DocumentCloud search tagged `OSF-IA-2025`](https://www.documentcloud.org/documents/?q=+%2Bdata__tag%3A%22OSF-IA-2025%22)
- **Iowa Attorney General opioid settlement information and report form:** [Iowa Attorney General – Opioid Settlement Information](https://www.iowaattorneygeneral.gov/news/opioid-settlement-information)
- **Governing allocation agreement:** [Iowa Opioid Allocation Memorandum of Understanding (MOU)](https://www.iowaattorneygeneral.gov/news/opioid-settlement-information/iowa-memorandum-of-understanding)


## Scope and methodology

- This funding dataset is intended to represent **county-reported information for state fiscal year 2025**.
- The site presents selected fields extracted using Tesseract OCR, reviewed as described below, and organized from the county annual reports. It is a secondary compilation, not the original reports.
- The project does **not** include separate city-level or state-level opioid settlement funds.
- City names in the search interface are geographic lookup aids based on the population file. Selecting a city takes the visitor to the associated county’s funding record. It does not mean the city received the county’s funds or that the displayed figures are city-specific.
- Population figures come from `data/IACityCountyPopulation2024.csv`, downloaded from [Iowa Data Hub - City Population in Iowa by County and Year](https://data.iowa.gov/catalog/dataset/705) and are used for city search and per-resident calculations. They are not sourced from the opioid settlement annual report.
- County boundaries come from `County.geojson` downloaded from [IowaDOT Open Data](https://public-iowadot.opendata.arcgis.com/).
- Statewide totals are calculated from available reported values. Per-resident measures combine reported FY2025 county spending with 2024 population estimates. They are descriptive calculations, not figures reported on the annual-report form.
- A spending-to-receipts percentage may exceed 100% when a county spends funds carried forward from a prior reporting year.

### PDF text extraction and transcription review

Tesseract OCR (optical character recognition) was used to extract text from the source PDF reports. For the funded-activities section, the extracted text was copied into Microsoft Word and reviewed to identify and correct apparent OCR or transcription errors before being included in the compiled dataset. The resulting text was then organized and formatted for this website. This was a quality-control step, not an independent audit or a guarantee of perfect transcription. OCR may misread characters, numbers, line breaks, tables, or text in low-quality scans, and manual proofreading may not identify every error. Where exact wording, a figure, or the context of an activity is important, readers should consult the original county PDF report. The source documents and transcription process may contain omissions, inconsistencies, ambiguous entries, or errors. The project may normalize formatting and organize reported information for comparison, but it does not independently establish facts absent from the source reports.

## Important limitations and disclaimer

**No independent audit or verification.** Figures and activity descriptions are attributed to the reporting local governments and are presented as reported. This dataset does not independently audit or verify the source reports, bank balances, receipts, expenditures, supporting documentation, the eligibility of expenditures under the MOU, or the accuracy or effectiveness of reported activities and outcomes. The site covers the county-level reporting included in this dataset. It is not a complete accounting of all settlement funds allocated, received, or spent by Iowa local governments or the State of Iowa. Separate city-level and state-level funds are outside the current scope. This is an independent informational project. It is not operated by, affiliated with, sponsored by, approved by, or endorsed by the State of Iowa, the Iowa Attorney General, any county or city, or any settlement administrator. References to public agencies, reports, and settlement documents identify source material only. Data is provided for general informational and transparency purposes. It is not legal, accounting, financial, or audit advice. The data and website are provided “as is,” without a representation or warranty that the information is complete, current, error-free, or suitable for a particular purpose, to the extent permitted by applicable law. Users should consult the original report, the applicable MOU, and the responsible government office before relying on a figure or drawing a conclusion. If a displayed value differs from an original report or official record, the original report or official record should be consulted. Questions about a county’s submission should be directed to that county. Questions about the state reporting form or MOU may be directed to the Iowa Attorney General through its [opioid settlement information page](https://www.iowaattorneygeneral.gov/news/opioid-settlement-information).

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

County links can be shared directly:

- `?fips=19153`
- `?county=Polk`

The browser console was designed to report data-loading and county-map matching diagnostics.
