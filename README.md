# Visa Document Checklist Generator

A React tool for AustralianTranslationServices. Users choose a destination, nationality, visa type and profile, then get a personalised document checklist with a readiness score. Documents that may need a certified translation are flagged and linked to the quote page.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/visa-checklist.js + dist/visa-checklist.css
```

## Embed anywhere

```html
<link rel="stylesheet" href="visa-checklist.css">
<div class="ats-visa-checklist"
     data-quote-url="https://australiantranslationservices.com.au/"
     data-default-destination="au"></div>
<script type="module" src="visa-checklist.js"></script>
```

| Attribute | Purpose |
|---|---|
| `data-quote-url` | Link for the "Get a free translation quote" button |
| `data-brand` | Brand name under the button |
| `data-default-destination` | `au`, `uk` or `us`: pre-selects a country (useful on country pages) |

All CSS is scoped under `.atsvc`, so it won't clash with the Divi theme.

## Project structure

```
src/
  data/
    common.js         shared document items, categories, profile questions
    nationalities.js  passports: English docs, ETA/eVisitor/ESTA eligibility, UK TB list
    australia.js      visa types + items for Australia
    uk.js             … United Kingdom
    usa.js            … United States
    index.js          destination registry + "last reviewed" date
  lib/checklist.js    filters items by profile, groups them, calculates the score
  components/         Steps (wizard), Results (checklist + score sidebar)
```

## Adding a country

1. Copy `src/data/uk.js` to e.g. `src/data/canada.js`.
2. Edit `visaTypes`, each item, `translationRule`, `nationalityNotes`, and the official links.
3. Add visitor-waiver info for the new country to `nationalities.js` if relevant.
4. Register it in `src/data/index.js`.

Each item supports `level` (`required` / `recommended`), `translatable` and an optional
`when: (ctx) => boolean`, where ctx holds the profile answers and nationality.

## Scoring

Required documents count 3 points and recommended ones 1 point. The score is the percentage of points ticked.
Progress is saved in the browser (localStorage) per destination and visa type.

## WordPress plugin (next step)

The plugin needs to:
1. Copy `dist/visa-checklist.js` and `dist/visa-checklist.css` into the plugin.
2. Register a shortcode `[ats_visa_checklist destination="au"]` that enqueues both files
   (JS with `type="module"`) and outputs the mount `<div>` with data attributes.

## Content review

Visa rules change often. Review the data files regularly and update `LAST_REVIEWED` in `src/data/index.js`.
