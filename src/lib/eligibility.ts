import type { Criterion, Profile, SchemeMatch, SchemeRequirement, EligibilityStatus } from './types';
import { INCOME_MIDPOINT_INR } from './types';
import { SCHEMES } from '../data/schemes';

/* ============================================================
   Data-driven eligibility engine — pure frontend, local mock
   data only. Each scheme's requirements are checked against the
   7-field profile; every criterion carries an explanation. A
   hard requirement left unmet marks the scheme not eligible.
   Results are indicative, never real-time government decisions.
   ============================================================ */

function assessRequirement(req: SchemeRequirement, p: Profile): Criterion {
  switch (req.id) {
    case 'category': {
      const ok = !req.projectTypes && !req.categories
        ? true // no constraint — informational pass
        : req.categories
          ? p.applicantCategory !== 'prefer-not-to-say' && req.categories.includes(p.applicantCategory)
          : true;
      const detail = req.categories
        ? ok
          ? `Applicant category (${p.applicantCategory.toUpperCase()}) is served by this scheme.`
          : `This scheme reserves support for: ${req.categories.map(c => c.toUpperCase()).join(', ')} applicants.`
        : 'Applicant category is accepted for this scheme.';
      return { id: 'category', label: 'Category', status: ok ? 'meets' : 'unmet', detail, hard: true };
    }
    case 'income': {
      const income = INCOME_MIDPOINT_INR[p.annualFamilyIncomeBand];
      if (!req.maxIncomeInr) {
        return {
          id: 'income', label: 'Income', status: 'meets',
          detail: 'No income ceiling applies in the prototype data — self-declared income is accepted.',
          hard: false,
        };
      }
      if (income === 0) {
        return {
          id: 'income', label: 'Income', status: 'partial',
          detail: `Scheme data shows a ceiling near ₹${Math.round(req.maxIncomeInr / 100000)}L; confirm your band to check it.`,
          hard: false,
        };
      }
      const ok = income <= req.maxIncomeInr;
      return {
        id: 'income', label: 'Income', status: ok ? 'meets' : 'unmet',
        detail: ok
          ? `Estimated family income (₹${Math.round(income / 100000)}L band) is within the ₹${Math.round(req.maxIncomeInr / 100000)}L limit.`
          : `Estimated family income (₹${Math.round(income / 100000)}L band) exceeds the ₹${Math.round(req.maxIncomeInr / 100000)}L limit.`,
        hard: false,
      };
    }
    case 'projectType': {
      const ok = !req.projectTypes || req.projectTypes.includes(p.projectType);
      return {
        id: 'projectType', label: 'Project type', status: ok ? 'meets' : 'unmet',
        detail: ok
          ? 'Your selected project type is covered by this scheme.'
          : 'Your selected project type is outside this scheme’s supported activities.',
        hard: true,
      };
    }
    case 'projectCost': {
      const min = req.projectCostL?.min ?? 0;
      const max = req.projectCostL?.max ?? Infinity;
      const cost = p.projectCostL;
      const ok = cost >= min && cost <= max;
      const partial = !ok && cost > 0;
      return {
        id: 'projectCost', label: 'Project cost', status: ok ? 'meets' : partial ? 'unmet' : 'partial',
        detail: ok
          ? `Project cost ₹${cost}L fits the supported window (₹${min}L–₹${max}L).`
          : `Project cost ₹${cost || '—'}L sits outside the supported window (₹${min}L–₹${max}L).`,
        hard: true,
      };
    }
    case 'education': {
      const ok = !req.education || (p.education !== '' && req.education.includes(p.education));
      return {
        id: 'education', label: 'Education', status: ok ? 'meets' : 'partial',
        detail: ok
          ? 'Your education level satisfies the training/EDP condition in the prototype data.'
          : 'An EDP/training certificate may be required — RSETI courses can provide it after selection.',
        hard: false,
      };
    }
    default:
      return { id: req.id, label: req.label, status: 'meets', detail: 'Requirement accepted in prototype data.', hard: false };
  }
}

export function recommendSchemes(p: Profile): SchemeMatch[] {
  return SCHEMES.map(scheme => {
    const criteria = scheme.requirements.map(req => assessRequirement(req, p));

    // Also factor the required loan amount into the loan-range criterion.
    const range = scheme.terms.loanRangeL;
    const loanOk = p.requiredLoanL >= range[0] && p.requiredLoanL <= range[1];
    criteria.push({
      id: 'loanRange',
      label: 'Loan range',
      status: loanOk ? 'meets' : 'unmet',
      detail: loanOk
        ? `Required ₹${p.requiredLoanL}L is within the ₹${range[0]}L–₹${range[1]}L band.`
        : `Required ₹${p.requiredLoanL}L is outside the ₹${range[0]}L–₹${range[1]}L band.`,
      hard: true,
    });

    const possible = criteria.filter(c => c.status !== 'partial').length || 1;
    const earned = criteria.reduce((a, c) => a + (c.status === 'meets' ? 1 : c.status === 'partial' ? 0.5 : 0), 0);
    const partialCount = criteria.filter(c => c.status === 'partial').length;
    const score = Math.round((earned / possible) * 100);
    const hardUnmet = criteria.some(c => c.hard && c.status === 'unmet');

    const status: EligibilityStatus = hardUnmet
      ? 'not-eligible'
      : score >= 85 && partialCount === 0
        ? 'eligible'
        : score >= 60
          ? 'partially-eligible'
          : 'not-eligible';

    return { scheme, status, score, criteria };
  }).sort((a, b) => {
    const rank: Record<EligibilityStatus, number> = { eligible: 0, 'partially-eligible': 1, 'not-eligible': 2 };
    return rank[a.status] - rank[b.status] || b.score - a.score;
  });
}

/** The profile fields required before matching makes sense. */
export function profileValid(p: Profile): boolean {
  return Boolean(
    p.education &&
    p.projectType &&
    p.location &&
    p.projectCostL > 0 &&
    p.requiredLoanL > 0,
  );
}
