import type { Scheme } from '../lib/types';

/* ============================================================
   Prototype scheme data — LOCAL MOCK ONLY.
   Figures are representative placeholders for demonstrating the
   matching flow. They are not live government data, and every
   screen using them carries the "verify with the concerned
   authority" instruction.
   ============================================================ */

export const SCHEMES: Scheme[] = [
  {
    id: 'mudra-kishore',
    name: 'Mudra Loan — Kishore',
    category: 'Credit',
    officialSource: 'https://www.mudra.org.in',
    terms: {
      loanRangeL: [0.5, 5],
      interestRatePct: 10.5,
      tenureMonths: 60,
      moratoriumMonths: 6,
    },
    requirements: [
      { id: 'category', label: 'Category', projectTypes: ['manufacturing', 'food-processing', 'textiles-handicrafts', 'agri-allied', 'retail-trading', 'services-personal', 'it-services', 'transport-logistics'] },
      { id: 'income', label: 'Income within limit' },
      { id: 'projectType', label: 'Project type', projectTypes: ['manufacturing', 'food-processing', 'textiles-handicrafts', 'agri-allied', 'retail-trading', 'services-personal', 'it-services', 'transport-logistics'] },
      { id: 'projectCost', label: 'Project cost within range', projectCostL: { min: 0, max: 12 } },
    ],
  },
  {
    id: 'mudra-tarun',
    name: 'Mudra Loan — Tarun',
    category: 'Credit',
    officialSource: 'https://www.mudra.org.in',
    terms: {
      loanRangeL: [5, 10],
      interestRatePct: 11.5,
      tenureMonths: 60,
      moratoriumMonths: 6,
    },
    requirements: [
      { id: 'category', label: 'Category', projectTypes: ['manufacturing', 'food-processing', 'textiles-handicrafts', 'agri-allied', 'retail-trading', 'services-personal', 'it-services', 'transport-logistics'] },
      { id: 'income', label: 'Income within limit' },
      { id: 'projectType', label: 'Project type', projectTypes: ['manufacturing', 'food-processing', 'textiles-handicrafts', 'agri-allied', 'retail-trading', 'services-personal', 'it-services', 'transport-logistics'] },
      { id: 'projectCost', label: 'Project cost within range', projectCostL: { min: 5, max: 15 } },
    ],
  },
  {
    id: 'pmegp',
    name: 'PMEGP — Margin Money Subsidy',
    category: 'Credit + subsidy',
    officialSource: 'https://www.kviconline.gov.in/pmegpeportal',
    terms: {
      loanRangeL: [2, 25],
      interestRatePct: 9,
      tenureMonths: 84,
      moratoriumMonths: 12,
    },
    requirements: [
      { id: 'category', label: 'Category', categories: ['sc', 'st', 'obc', 'minority', 'general'] },
      { id: 'income', label: 'Income within limit', maxIncomeInr: 1000000 },
      { id: 'projectType', label: 'Project type', projectTypes: ['manufacturing', 'food-processing', 'textiles-handicrafts', 'agri-allied', 'services-personal', 'it-services'] },
      { id: 'projectCost', label: 'Project cost within range', projectCostL: { min: 2, max: 50 } },
      { id: 'education', label: 'Education (EDP-ready)', education: ['secondary', 'senior-secondary', 'graduate', 'postgraduate', 'professional'] },
    ],
  },
  {
    id: 'standup',
    name: 'Stand-Up India',
    category: 'Credit',
    officialSource: 'https://www.standupmitra.in',
    terms: {
      loanRangeL: [10, 100],
      interestRatePct: 10.25,
      tenureMonths: 84,
      moratoriumMonths: 18,
    },
    requirements: [
      { id: 'category', label: 'Category (SC / ST / woman)', categories: ['sc', 'st'] },
      { id: 'income', label: 'Income within limit' },
      { id: 'projectType', label: 'Project type', projectTypes: ['manufacturing', 'food-processing', 'textiles-handicrafts', 'agri-allied', 'retail-trading', 'services-personal', 'transport-logistics'] },
      { id: 'projectCost', label: 'Project cost within range', projectCostL: { min: 10, max: 150 } },
    ],
  },
  {
    id: 'pmfme',
    name: 'PMFME — Food Processing Subsidy',
    category: 'Credit + subsidy',
    officialSource: 'https://pmfme.mofpi.gov.in',
    terms: {
      loanRangeL: [1, 10],
      interestRatePct: 8.5,
      tenureMonths: 60,
      moratoriumMonths: 12,
    },
    requirements: [
      { id: 'category', label: 'Category', projectTypes: ['food-processing'] },
      { id: 'income', label: 'Income within limit' },
      { id: 'projectType', label: 'Project type', projectTypes: ['food-processing', 'agri-allied'] },
      { id: 'projectCost', label: 'Project cost within range', projectCostL: { min: 1, max: 15 } },
    ],
  },
  {
    id: 'skill-edp',
    name: 'RSETI Skill & EDP Training',
    category: 'Skill & training',
    officialSource: 'https://www.nsdcindia.org',
    terms: {
      loanRangeL: [0, 2],
      interestRatePct: 0,
      tenureMonths: 12,
      moratoriumMonths: 0,
    },
    requirements: [
      { id: 'category', label: 'Category' },
      { id: 'income', label: 'Income within limit' },
      { id: 'projectType', label: 'Project type', projectTypes: ['manufacturing', 'food-processing', 'textiles-handicrafts', 'agri-allied', 'retail-trading', 'services-personal', 'it-services', 'transport-logistics'] },
      { id: 'projectCost', label: 'Project cost within range', projectCostL: { min: 0, max: 10 } },
    ],
  },
];

export function schemeById(id: string): Scheme | undefined {
  return SCHEMES.find(s => s.id === id);
}
