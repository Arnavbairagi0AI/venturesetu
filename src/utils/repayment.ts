import type { SchemeTerms } from '../lib/types';

/* ============================================================
   Frontend repayment math — standard reducing-balance EMI with a
   simple interest-only moratorium, then a full monthly
   amortisation schedule. Demonstration figures only.
   ============================================================ */

export interface MonthRow {
  month: number;
  principal: number;
  interest: number;
  emi: number;
  balance: number;
}

export interface RepaymentSummary {
  loanInr: number;
  emi: number;
  totalInterest: number;
  totalRepayment: number;
  tenureMonths: number;
  moratoriumMonths: number;
  schedule: MonthRow[];
}

/** Standard EMI for a reducing-balance loan. */
export function emiOf(loanInr: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return loanInr / months;
  const f = Math.pow(1 + r, months);
  return (loanInr * r * f) / (f - 1);
}

export function computeRepayment(
  loanL: number,
  terms: Pick<SchemeTerms, 'interestRatePct' | 'tenureMonths' | 'moratoriumMonths'>,
): RepaymentSummary {
  const loanInr = Math.max(0, loanL) * 100000;
  const rate = Math.max(0, terms.interestRatePct);
  const tenure = Math.max(1, Math.round(terms.tenureMonths));
  const moratorium = Math.min(Math.max(0, Math.round(terms.moratoriumMonths)), tenure - 1);

  // Interest accrues during moratorium and is capitalised into the balance.
  const morInterest = (loanInr * (rate / 100) * moratorium) / 12;
  const balloon = loanInr + morInterest;
  const payingMonths = tenure - moratorium;

  const emi = emiOf(balloon, rate, payingMonths);

  const schedule: MonthRow[] = [];
  // Moratorium rows: interest-only, no principal.
  for (let m = 1; m <= moratorium; m++) {
    schedule.push({ month: m, principal: 0, interest: Math.round(morInterest / moratorium), emi: Math.round(morInterest / moratorium), balance: Math.round(balloon) });
  }
  // Repayment rows.
  let balance = balloon;
  let totalInterest = moratorium > 0 ? morInterest : 0;
  for (let m = moratorium + 1; m <= tenure; m++) {
    const interest = balance * (rate / 100) / 12;
    const principal = Math.min(emi - interest, balance);
    balance -= principal;
    totalInterest += interest;
    schedule.push({
      month: m,
      principal: Math.round(principal),
      interest: Math.round(interest),
      emi: Math.round(emi),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  return {
    loanInr: Math.round(loanInr),
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(loanInr + totalInterest),
    tenureMonths: tenure,
    moratoriumMonths: moratorium,
    schedule,
  };
}

export const inr = (n: number): string => '₹' + Math.round(n).toLocaleString('en-IN');
