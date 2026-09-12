# VentureSetu

**AI-Driven Scheme Matching for Marginalized Entrepreneurs** — a frontend-only decision-support prototype built for Smart India Hackathon problem **SIH26092**.

VentureSetu helps a first-generation entrepreneur answer three questions in order:

> **Can I qualify?** → **What will I repay?** → **Where should I go?**

It organises public scheme information into an explainable recommendation. It is **not** an application portal and makes **no claim of approval or funding** — final decisions rest with banks and government departments.

---

## The journey

```
Dashboard → Applicant Profile → Eligibility Results → Select Scheme
          → Repayment Calculator → Partner Locator → Final Recommendation
```

## Pages & routes

| Page (file) | Route | What it does |
|---|---|---|
| `Dashboard` (`src/pages/Dashboard.tsx`) | `/` | Positions the product (Can I qualify? → What will I repay? → Where should I go?), shows a live journey tracker and honesty banner |
| `ApplicantProfile` (`src/pages/ApplicantProfile.tsx`) | `/profile` | Seven-field form — applicant category, family income band, education, project type, project cost, required loan amount, state — with validation. Collects no Aadhaar/PAN/OTP/credentials |
| `Eligibility` (`src/pages/Eligibility.tsx`) | `/eligibility` | Runs the rules engine over the profile; ranked scheme cards with per-criterion ✓/△/✕ reasoning, hard-requirement blocking, and a "Why this matches" explainer. Empty state funnels to `/profile` |
| `Repayment` (`src/pages/Repayment.tsx`) | `/repayment` | Auto-fills interest rate, tenure and moratorium from the selected scheme; you set the loan amount. Shows EMI, total interest, total repayment, tenure/moratorium stats, a monthly amortisation table and a principal-vs-interest donut |
| `PartnerLocator` (`src/pages/PartnerLocator.tsx`) | `/partners` | Nine mock institutions filtered by scheme/type/location, sorted by mock distance, labelled map placeholder ("Map integration — future implementation"), details modal |
| `Recommendation` (`src/pages/Recommendation.tsx`) | `/recommendation` | One printable sheet: recommended scheme, why-you-match, estimated repayment, authorized partner, ordered next steps, disclaimers |
| `Sources` (`src/pages/Sources.tsx`) | `/about` | Methodology, honesty constraints, official portal links, privacy note |

Plus a 404 page with a working route back.

## Structure

```
src/
├── components/          Navbar · SchemeCard · EligibilityReason ·
│                        RepaymentSummary · PartnerCard · ProgressStepper
│                        (+ shared ui primitives, charts, layout shell)
├── pages/               Dashboard · ApplicantProfile · Eligibility · Repayment ·
│                        PartnerLocator · Recommendation · Sources
├── data/
│   ├── schemes.ts       6-scheme mock catalogue (terms + eligibility rules)
│   └── partners.ts      9 mock partner institutions
├── utils/
│   └── repayment.ts     Repayment math (frontend-only)
├── lib/                 types · eligibility engine · profile store (localStorage) · format
└── App.tsx              React Router routes
```

## The repayment model — exactly

`utils/repayment.ts` computes a **standard reducing-balance EMI** (`EMI = P·r·(1+r)^n / ((1+r)^n − 1)`) over the repayment months, with **moratorium interest capitalised into the principal** before EMI computation (interest accrues monthly during the moratorium; no payments are due, the balance grows). The schedule starts with interest-only moratorium rows, then full EMI rows amortising to ₹0. That is the entire model — **no fees, no subsidies, no affordability ratios** are applied.

## Eligibility engine — exactly

`lib/eligibility.ts` is deterministic and rule-based (no AI, no API): each scheme declares checkable requirements (category, income ceiling, project type, project cost window, education, loan range). Every requirement resolves to *meets / partial / unmet* with a human-readable reason; a hard requirement left unmet marks the scheme **not eligible**. The score is the share of requirements satisfied.

## Data & honesty

- **All data is local mock data** committed in `src/data/` — no backend, no auth, no database, no government API, no real-time anything.
- Profile, selections and journey progress persist in **localStorage only**.
- Amounts, rates and terms are **prototype figures**; every scheme card links its official portal (mudra.org.in, standupmitra.in, pmfme.mofpi.gov.in, kviconline.gov.in, nsdcindia.org) and every page carries verify-first disclaimers.
- The partner capacity bar is labelled *"Prototype indicator — not live data"*; distances are mock straight-line values.
- Anti-fraud warnings: nothing official ever charges a fee through private agents or confirms loans over WhatsApp.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build
```

CI runs `tsc -b`, `eslint src` and `npm run build` on every PR.

## Roadmap (post-prototype)

- Sync scheme criteria from official portals with dated provenance
- Real partner directory and map integration
- Regional-language UI and accessibility hardening
- Unit tests for the eligibility and repayment engines
