import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calculator, Info, Table2 } from 'lucide-react';
import { Banner, Btn, Card, CardHead, Chip, Field, Input } from '../components/ui';
import RepaymentSummary from '../components/RepaymentSummary';
import { schemeById } from '../data/schemes';
import { computeRepayment, inr } from '../utils/repayment';
import { useProfileStore } from '../lib/profileStore';

/* ============================================================
   Step 3 — Repayment calculator. The selected scheme
   auto-fills interest, tenure and moratorium; the applicant
   enters the loan amount. Monthly amortisation table + simple
   principal-vs-interest chart. "Estimated Repayment — for
   demonstration purposes only."
   ============================================================ */

export default function Repayment() {
  const store = useProfileStore();
  const { selectedSchemeId, profile } = store;
  const navigate = useNavigate();
  const scheme = selectedSchemeId ? schemeById(selectedSchemeId) : undefined;

  const [loanL, setLoanL] = useState<number>(profile.requiredLoanL || scheme?.terms.loanRangeL[1] || 5);
  const [showFullTable, setShowFullTable] = useState(false);

  const summary = useMemo(
    () => (scheme ? computeRepayment(loanL, scheme.terms) : null),
    [scheme, loanL],
  );

  // Keep the modelled amount for the Recommendation page so the journey stays consistent.
  useEffect(() => {
    if (scheme && loanL > 0 && loanL !== profile.modelledLoanL) {
      store.setProfile({ modelledLoanL: loanL });
    }
  }, [scheme, loanL, profile.modelledLoanL]);


  if (!scheme || !summary) {
    return (
      <div className="space-y-5">
        <h1 className="text-[22px] font-bold tracking-tight text-ink-900">Repayment calculator</h1>
        <Banner tone="info" title="Select a scheme first.">
          The calculator pre-fills interest rate, tenure and moratorium from your chosen scheme.
        </Banner>
        <Link to="/eligibility"><Btn>Go to eligibility results <ArrowRight size={15} /></Btn></Link>
      </div>
    );
  }

  const [minL, maxL] = scheme.terms.loanRangeL;
  const tableRows = showFullTable ? summary.schedule : summary.schedule.slice(0, 12);
  const outOfRange = loanL < minL || loanL > maxL;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5 text-[22px] font-bold tracking-tight text-ink-900">
            <Calculator size={22} className="text-ink-900" /> Repayment calculator
          </h1>
          <p className="mt-1 max-w-3xl text-[13.5px] leading-relaxed text-ink-600">
            Estimated Repayment — <strong className="font-semibold text-ink-800">for demonstration purposes only</strong>.
            Actual rates and terms depend on the lender and the guidelines in force.
          </p>
        </div>
        <Link to="/eligibility" className="btn-outline flex items-center gap-2 px-4 py-2.5 text-[13.5px]">
          <ArrowLeft size={14} /> Back to matches
        </Link>
      </header>

      {/* selected scheme context */}
      <Card className="flex flex-wrap items-center gap-3 px-5 py-4">
        <div className="mr-auto">
          <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">Selected scheme</div>
          <div className="text-[14.5px] font-bold text-ink-900">{scheme.name}</div>
        </div>
        <Chip tone="teal">{scheme.terms.interestRatePct}% p.a. (auto)</Chip>
        <Chip tone="teal">{scheme.terms.tenureMonths}-month tenure (auto)</Chip>
        <Chip tone="teal">{scheme.terms.moratoriumMonths}-month moratorium (auto)</Chip>
        <Chip>Supports ₹{minL}L–₹{maxL}L</Chip>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* inputs */}
        <Card className="h-fit lg:sticky lg:top-28">
          <CardHead title="Loan amount" sub="The only field you need to set" />
          <div className="space-y-4 px-5 py-5">
            <Field label="Loan amount" hint="₹ lakh" required error={outOfRange ? `Scheme band is ₹${minL}L–₹${maxL}L.` : undefined}>
              <Input
                type="number" min={0} step={0.5} inputMode="decimal"
                value={loanL || ''}
                onChange={e => setLoanL(Math.max(0, Number(e.target.value) || 0))}
              />
            </Field>
            <input
              type="range" min={minL * 100000} max={maxL * 100000} step={25000}
              value={Math.min(Math.max(loanL, minL), maxL) * 100000}
              onChange={e => setLoanL(Number(e.target.value) / 100000)}
              className="w-full accent-[#123c63]"
              aria-label="Loan amount slider"
            />
            <div className="tnum flex justify-between text-[11px] text-ink-400">
              <span>₹{minL}L</span><span>₹{maxL}L</span>
            </div>
            {outOfRange && (
              <Banner tone="warn" title="Outside the scheme band.">
                Numbers still compute so you can compare, but this scheme funds ₹{minL}L–₹{maxL}L.
              </Banner>
            )}
          </div>
        </Card>

        {/* results */}
        <div className="space-y-5">
          <RepaymentSummary summary={summary} />

          {/* amortization table */}
          <Card>
            <CardHead
              title={<span className="flex items-center gap-2"><Table2 size={15} /> Amortization schedule</span>}
              sub={`Month-by-month split · ${summary.moratoriumMonths > 0 ? `first ${summary.moratoriumMonths} months are interest-only moratorium` : 'EMI from month 1'}`}
              right={
                <button onClick={() => setShowFullTable(s => !s)} className="btn-outline px-3 py-1.5 text-[12px]">
                  {showFullTable ? 'Show first year' : `Show all ${summary.schedule.length} months`}
                </button>
              }
            />
            <div className="max-h-[420px] overflow-auto">
              <table className="tnum w-full min-w-[540px] text-[12.5px]">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-ink-200 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-2.5">Month</th>
                    <th className="px-5 py-2.5 text-right">Principal</th>
                    <th className="px-5 py-2.5 text-right">Interest</th>
                    <th className="px-5 py-2.5 text-right">EMI</th>
                    <th className="px-5 py-2.5 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map(r => (
                    <tr key={r.month} className={`border-b border-ink-100 last:border-0 ${r.principal === 0 ? 'bg-saffron-50/60' : ''}`}>
                      <td className="px-5 py-2 font-medium text-ink-800">
                        {r.month}
                        {r.month <= summary.moratoriumMonths && (
                          <span className="ml-1.5 text-[10px] font-semibold uppercase text-saffron-600">moratorium</span>
                        )}
                      </td>
                      <td className="px-5 py-2 text-right text-ink-700">{inr(r.principal)}</td>
                      <td className="px-5 py-2 text-right text-ink-700">{inr(r.interest)}</td>
                      <td className="px-5 py-2 text-right text-ink-700">{inr(r.emi)}</td>
                      <td className="px-5 py-2 text-right font-medium text-ink-900">{inr(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white px-5 py-4">
            <p className="flex items-center gap-2 text-[13px] text-ink-600">
              <Info size={15} className="text-teal-400" />
              Happy with the estimate? Find who processes this scheme near you.
            </p>
            <Btn onClick={() => { store.markComplete('repayment'); navigate('/partners'); }}>
              Continue to partner locator <ArrowRight size={15} />
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
