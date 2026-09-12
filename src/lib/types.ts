/* ============================================================
   VentureSetu domain types — frontend prototype only.
   All matching runs on local mock data. No backend, no AI API,
   no database. Results are indicative, never approvals.
   ============================================================ */

/* ---------------- applicant profile ---------------- */

export type ApplicantCategory = 'general' | 'obc' | 'sc' | 'st' | 'minority' | 'prefer-not-to-say';
export type IncomeBand = 'below-3l' | '3-6l' | '6-10l' | 'above-10l' | 'prefer-not-to-say';
export type EducationLevel =
  | 'below-secondary'
  | 'secondary'
  | 'senior-secondary'
  | 'graduate'
  | 'postgraduate'
  | 'professional';

/** The seven spec'd profile fields — kept deliberately small. */
export interface Profile {
  applicantCategory: ApplicantCategory;
  annualFamilyIncomeBand: IncomeBand;
  education: EducationLevel | '';
  projectType: string; // sector id from data/schemes.ts
  projectCostL: number;
  requiredLoanL: number;
  location: string; // state name from STATES
  /** Loan amount actually modelled in the repayment calculator (₹L); null until set. */
  modelledLoanL: number | null;
}

export const EMPTY_PROFILE: Profile = {
  applicantCategory: 'prefer-not-to-say',
  annualFamilyIncomeBand: 'prefer-not-to-say',
  education: '',
  projectType: '',
  projectCostL: 0,
  requiredLoanL: 0,
  location: '',
  modelledLoanL: null,
};

export const APPLICANT_CATEGORIES: { value: ApplicantCategory; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'minority', label: 'Minority' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const INCOME_BANDS: { value: IncomeBand; label: string }[] = [
  { value: 'below-3l', label: 'Below ₹3 lakh' },
  { value: '3-6l', label: '₹3 – 6 lakh' },
  { value: '6-10l', label: '₹6 – 10 lakh' },
  { value: 'above-10l', label: 'Above ₹10 lakh' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const EDUCATION_LEVELS: { value: EducationLevel; label: string }[] = [
  { value: 'below-secondary', label: 'Below secondary' },
  { value: 'secondary', label: 'Secondary (10th)' },
  { value: 'senior-secondary', label: 'Senior secondary (12th)' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'postgraduate', label: 'Post-graduate' },
  { value: 'professional', label: 'Professional / technical degree' },
];

export const PROJECT_TYPES: { id: string; label: string }[] = [
  { id: 'manufacturing', label: 'Small-scale manufacturing' },
  { id: 'food-processing', label: 'Food processing / packaging' },
  { id: 'textiles-handicrafts', label: 'Textiles, handloom & handicrafts' },
  { id: 'agri-allied', label: 'Agriculture & allied (dairy, poultry)' },
  { id: 'retail-trading', label: 'Retail / trading' },
  { id: 'services-personal', label: 'Personal services (salon, repair, tailoring)' },
  { id: 'it-services', label: 'IT / digital services' },
  { id: 'transport-logistics', label: 'Transport & logistics' },
];

export const STATES: string[] = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi NCR', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura', 'Other',
];

/** Income band → indicative annual income midpoint (₹), used by the rule engine. */
export const INCOME_MIDPOINT_INR: Record<IncomeBand, number> = {
  'below-3l': 200000,
  '3-6l': 450000,
  '6-10l': 800000,
  'above-10l': 1200000,
  'prefer-not-to-say': 0,
};

/* ---------------- schemes (mock catalogue) ---------------- */

export type SchemeCategory = 'Credit' | 'Credit + subsidy' | 'Skill & training' | 'Enterprise & market support';

export interface SchemeTerms {
  loanRangeL: [number, number];
  interestRatePct: number;
  tenureMonths: number;
  moratoriumMonths: number;
}

/** A single checkable requirement inside a scheme's eligibility spec. */
export interface SchemeRequirement {
  id: string;
  label: string;
  /** Optional hard ceiling on annual family income (₹). */
  maxIncomeInr?: number;
  /** Project types that satisfy this requirement. */
  projectTypes?: string[];
  /** Project cost window (₹ lakh). */
  projectCostL?: { min: number; max: number };
  /** Applicant categories that satisfy this requirement. */
  categories?: ApplicantCategory[];
  /** Education levels that satisfy this requirement. */
  education?: EducationLevel[];
}

export interface Scheme {
  id: string;
  name: string;
  category: SchemeCategory;
  officialSource: string;
  terms: SchemeTerms;
  requirements: SchemeRequirement[];
}

/* ---------------- eligibility results ---------------- */

export type CriterionStatus = 'meets' | 'partial' | 'unmet';

export interface Criterion {
  id: string;
  label: string;
  status: CriterionStatus;
  /** Human explanation of what matched or what is missing. */
  detail: string;
  /** Hard requirement: an unmet status makes the whole scheme not eligible. */
  hard: boolean;
}

export type EligibilityStatus = 'eligible' | 'partially-eligible' | 'not-eligible';

export interface SchemeMatch {
  scheme: Scheme;
  status: EligibilityStatus;
  /** 0–100 share of requirements satisfied (partial counts half). */
  score: number;
  criteria: Criterion[];
}

/* ---------------- partners ---------------- */

export type PartnerType =
  | 'Public sector bank'
  | 'Private bank'
  | 'NBFC'
  | 'Training institute (RSETI)'
  | 'Handholding agency'
  | 'Regional office';

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  /** Scheme ids this partner is authorised to process. */
  authorizedSchemeIds: string[];
  /** Station / branch location. */
  location: string;
  /** Mock straight-line distance in km from the applicant's district HQ. */
  distanceKm: number;
  contact: string;
  authorization: 'authorized' | 'empanelled' | 'referral';
  /** Prototype capacity indicator — explicitly NOT live data. */
  capacityPct: number;
}

/* ---------------- journey ---------------- */

export type StepId = 'profile' | 'eligibility' | 'repayment' | 'partner';
