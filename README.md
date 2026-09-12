# VentureSetu

**AI-Driven Scheme Matching for Marginalized Entrepreneurs** — a Smart India Hackathon
prototype. React 19 + TypeScript + Vite + Tailwind CSS 4.

VentureSetu is a **decision-support tool**: it helps first-generation and marginalized
entrepreneurs figure out *which Indian enterprise-support scheme categories their venture
profile may fit*, what the repayment could look like, and *which institutions typically
handle these files* — before they spend days travelling to offices.

> **It is not a lender, not a government portal, and not an application channel.**
> It never claims an approval, guarantee or sanction. Every result carries a
> verify-first instruction pointing to the scheme's official portal.

## User journey

```
Applicant profile  →  Eligibility recommender  →  Matched scheme + explanation
       →  Repayment calculator  →  Authorized partner locator  →  Final recommendation
```

A persistent stepper tracks the six steps; progress and profile answers are saved in
`localStorage` only.

## Navigation

| Page | Purpose |
|---|---|
| **Dashboard** (`/`) | Explains the tool, tracks the journey, carries the honesty banner |
| **Eligibility** (`/eligibility`) | Applicant profile + explainable, rule-based scheme matching |
| **Repayment** (`/repayment`) | Reducing-balance EMI, moratorium, fee, subsidy, affordability check |
| **Partner Locator** (`/partners`) | Institution types (PSBs, RSETIs, DICs, NEDFi…) with verify-first guidance |
| **About / Sources** (`/about`) | What the tool is / is not, methodology, official portals, privacy |
| **Final recommendation** (`/recommendation`) | Journey recap + ordered next actions + print-to-PDF |

## How the matching works (transparent by design)

Each of the 12 catalogued scheme categories contributes a small set of **criteria**
derived from its publicly described focus. Each criterion resolves to
`meets / partial / unmet / note`; the score is the share of assessable criteria
satisfied (partial = ½, notes excluded). **Hard requirements block a scheme outright**
— e.g. a non-SC/ST/non-woman applicant is never shown Stand-Up India; a non-food
business is never shown PMFME. There is no hidden ML score — every line can be
checked against the official guidelines, which is exactly what the user is asked to do.

## Honest-by-construction

- No approval, sanction, "guaranteed loan" or approval-probability language anywhere.
- Amounts are labelled "commonly quoted" and every scheme card links the official portal
  (mudra.org.in, kviconline.gov.in, standupmitra.in, cgtmse.in, pmfme.mofpi.gov.in, …).
- Anti-fraud guidance is built in (no agent fees, decisions come only in writing from lenders).
- No logins, no uploads, no backend — all computation and storage are browser-local.

## Quickstart

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run lint       # eslint (clean)
```

## Project structure

```
src/
  components/    ui.tsx (primitives) · charts.tsx (SVG donut/bars) · layout.tsx (shell)
  lib/           types.ts · schemes.ts (catalogue) · eligibility.ts (rules engine)
                 repayment.ts (amortisation) · partners.ts · profileStore.tsx · format.ts
  pages/         Dashboard · Eligibility · Repayment · Partners · Recommendation · About
```

## Production roadmap (for the pitch)

Guideline-sync from official feeds with dated provenance per criterion · multilingual UI
starting with Hindi/Odia/Tamil · offline-first delivery for low-connectivity districts ·
DIC/RSETI pilot partnerships for feedback loops.
