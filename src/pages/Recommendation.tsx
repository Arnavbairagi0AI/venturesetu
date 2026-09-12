import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, FileCheck2, Printer, ShieldAlert,
  CheckCircle2, MapPin, Landmark, Building2,
} from 'lucide-react';
import { Banner, Btn, Card, CardHead, Chip } from '../components/ui';
import { recommendSchemes, profileValid } from '../lib/eligibility';
import { useProfileStore } from '../lib/profileStore';
import { schemeById } from '../data/schemes';
import { PARTNERS } from '../data/partners';
import { computeRepayment, inr } from '../utils/repayment';
import type { Criterion } from '../lib/types';

/* ============================================================
   Step 5 — Final Recommendation. One page assembling the
   selected scheme, why-you-match, repayment estimate and the
   chosen/nearest authorized partner. Prototype output only —
   never an approval, guarantee or disbursement commitment.
   ============================================================ */

const WHY_LABELS = ['Category', 'Income', 'Project type', 'Project cost'];

export default function Recommendation() {
  const store = useProfileStore();
  const { profile, selectedSchemeId, selectedPartnerId } = store;
  const navigate = useNavigate();

  const valid = profileValid(profile);

  const matches = useMemo(() => (valid ? recommendSchemes(profile) : []), [valid, profile]);
  const topEligible = matches.find(m => m.status !== 'not-eligible');
  const scheme = selectedSchemeId ? schemeById(selectedSchemeId) : topEligible?.scheme;

  const partner = useMemo(() => {
    if (selectedPartnerId) {
      const chosen = PARTNERS.find(p => p.id === selectedPartnerId);
      if (chosen) return chosen;
    }
    if (!scheme) return undefined;
    return PARTNERS.filter(p => p.authorizedSchemeIds.includes(scheme.id)).sort(
      (a, b) => a.distanceKm - b.distanceKm,
    )[0];
  }, [selectedPartnerId, scheme]);

  const summary = useMemo(
    () => (scheme ? computeRepayment((profile.modelledLoanL ?? profile.requiredLoanL) || scheme.terms.loanRangeL[0], scheme.terms) : null),
    [scheme, profile.modelledLoanL, profile.requiredLoanL],
  );

  const whyCriteria: Criterion[] = scheme && matches.length
    ? (matches.find(m => m.scheme.id === scheme.id)?.criteria ?? []).filter(c => WHY_LABELS.includes(c.label))
    : [];

  if (!valid) {
    return (
      <div className="space-y-5">
        <h1 className="text-[22px] font-bold tracking-tight text-ink-900">Final recommendation</h1>
        <Banner tone="info" title="Complete the journey steps first.">
          Fill the applicant profile and review your eligibility results — this page then assembles your
          one-page summary automatically.
        </Banner>
        <Link to="/profile"><Btn>Start with the profile <ArrowRight size={15} /></Btn></Link>
      </div>
    );
  }

  if (!scheme || !summary) {
    return (
      <div className="space-y-5">
        <h1 className="text-[22px] font-bold tracking-tight text-ink-900">Final recommendation</h1>
        <Banner tone="info" title="No eligible scheme to summarise yet.">
          Review your matches and select a scheme so this page can assemble your recommendation.
        </Banner>
        <Link to="/eligibility"><Btn>Go to eligibility results <ArrowRight size={15} /></Btn></Link>
      </div>
    );
  }

  const [minL, maxL] = scheme.terms.loanRangeL;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5 text-[22px] font-bold tracking-tight text-ink-900">
            <FileCheck2 size={22} className="text-ink-900" /> Final recommendation
          </h1>
          <p className="mt-1 max-w-3xl text-[13.5px] leading-relaxed text-ink-600">
            Your complete result in one page — assembled from <strong className="font-semibold text-ink-800">prototype
            data</strong> for planning and verification, not a sanction decision.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/partners" className="btn-outline flex items-center gap-2 px-4 py-2.5 text-[13.5px]">
            <ArrowLeft size={14} /> Back to partners
          </Link>
          <Btn variant="outline" onClick={() => window.print()}><Printer size={15} /> Print / PDF</Btn>
        </div>
      </header>

      {/* 1 — recommended scheme */}
      <Card className="border-l-4 border-l-saffron-400">
        <CardHead
          title={
            <span className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">Recommended scheme</span>
            </span>
          }
          sub="Closest fit under prototype rules — always verify on the official portal"
          right={<Chip tone="green">{scheme.category}</Chip>}
        />
        <div className="flex flex-wrap items-center gap-4 px-5 py-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-50 text-ink-900">
            <Landmark size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[19px] font-bold tracking-tight text-ink-900">{scheme.name}</h2>
            <dl className="tnum mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-ink-600">
              <div><dt className="inline text-ink-400">Loan range: </dt><dd className="inline font-semibold text-ink-800">₹{minL}L – ₹{maxL}L</dd></div>
              <div><dt className="inline text-ink-400">Interest: </dt><dd className="inline font-semibold text-ink-800">{scheme.terms.interestRatePct}% p.a.</dd></div>
              <div><dt className="inline text-ink-400">Tenure: </dt><dd className="inline font-semibold text-ink-800">{scheme.terms.tenureMonths} months</dd></div>
              <div><dt className="inline text-ink-400">Moratorium: </dt><dd className="inline font-semibold text-ink-800">{scheme.terms.moratoriumMonths} months</dd></div>
            </dl>
          </div>
          <a href={scheme.officialSource} target="_blank" rel="noreferrer" className="link text-[12px]">
            Official portal ↗
          </a>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 2 — why you match */}
        <Card>
          <CardHead title="Why you match" sub="Checked against this scheme's prototype requirements" />
          <ul className="space-y-3 px-5 py-5">
            {whyCriteria.map(c => {
              const ok = c.status === 'meets';
              const partial = c.status === 'partial';
              return (
                <li key={c.id} className="flex items-start gap-3">
                  {ok
                    ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#2f9e63]" />
                    : partial
                      ? <span className="mt-0.5 shrink-0 font-bold text-saffron-500">△</span>
                      : <span className="mt-0.5 shrink-0 font-bold text-[#d95c68]">✕</span>}
                  <div>
                    <p className={`text-[13.5px] font-semibold ${ok ? 'text-ink-900' : partial ? 'text-[#7a5a0c]' : 'text-[#b23a48]'}`}>
                      {c.label} {ok ? 'matched' : partial ? 'partially matched' : 'not matched'}
                    </p>
                    <p className="text-[12.5px] leading-snug text-ink-500">{c.detail}</p>
                  </div>
                </li>
              );
            })}
            {whyCriteria.length === 0 && (
              <li className="text-[13px] text-ink-500">Criteria will appear after matching runs on the eligibility page.</li>
            )}
          </ul>
        </Card>

        {/* 3 — estimated repayment */}
        <Card>
          <CardHead
            title="Estimated repayment"
            sub="For demonstration purposes only — actual offers differ by lender"
          />
          <dl className="tnum grid grid-cols-2 gap-4 px-5 py-5 text-[13px]">
            <div className="card-flat px-3.5 py-3">
              <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">Loan amount</dt>
              <dd className="mt-0.5 text-[16px] font-bold text-ink-900">{inr(summary.loanInr)}</dd>
            </div>
            <div className="card-flat px-3.5 py-3">
              <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">Interest rate</dt>
              <dd className="mt-0.5 text-[16px] font-bold text-ink-900">{scheme.terms.interestRatePct}% p.a.</dd>
            </div>
            <div className="card-flat border-t-[3px] border-t-saffron-400 px-3.5 py-3">
              <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">Estimated EMI</dt>
              <dd className="mt-0.5 text-[16px] font-bold text-ink-900">{inr(summary.emi)}<span className="text-[11px] font-medium text-ink-400"> /mo</span></dd>
            </div>
            <div className="card-flat px-3.5 py-3">
              <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">Total interest</dt>
              <dd className="mt-0.5 text-[16px] font-bold text-ink-900">{inr(summary.totalInterest)}</dd>
            </div>
            <div className="col-span-2 card-flat px-3.5 py-3">
              <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">Tenure</dt>
              <dd className="mt-0.5 text-[13.5px] font-semibold text-ink-800">
                {summary.tenureMonths} months
                {summary.moratoriumMonths > 0 && <span className="font-normal text-ink-500"> · includes a {summary.moratoriumMonths}-month moratorium</span>}
              </dd>
            </div>
          </dl>
          <div className="border-t border-ink-200 px-5 py-3">
            <Link to="/repayment" className="link text-[12.5px]">Open the full calculator & schedule <ArrowRight size={12} className="inline" /></Link>
          </div>
        </Card>
      </div>

      {/* 4 — authorized partner */}
      <Card>
        <CardHead title="Authorized partner" sub="Where this route is typically processed — verify before visiting" />
        {partner ? (
          <div className="flex flex-wrap items-center gap-4 px-5 py-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-900">
              <Building2 size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold text-ink-900">{partner.name}</h3>
              <p className="text-[12.5px] text-ink-500">{partner.type}</p>
            </div>
            <div className="tnum flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-ink-600">
              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-ink-400" /> {partner.location}</span>
              <span>{partner.distanceKm} km <span className="text-ink-400">(mock)</span></span>
              <span
                className={`chip ${partner.authorization === 'authorized' ? 'chip-green' : partner.authorization === 'empanelled' ? 'chip-teal' : 'chip-saffron'}`}
              >
                {partner.authorization === 'authorized' ? 'Authorized' : partner.authorization === 'empanelled' ? 'Empanelled' : 'Referral desk'}
              </span>
            </div>
          </div>
        ) : (
          <div className="px-5 py-5 text-[13px] text-ink-600">
            No partner is catalogued for this scheme in the prototype data — ask your District Industries Centre
            for the current list of handling institutions.
          </div>
        )}
        <div className="border-t border-ink-200 px-5 py-3">
          <Link to="/partners" className="link text-[12.5px]">Browse all partners & filters <ArrowRight size={12} className="inline" /></Link>
        </div>
      </Card>

      {/* 5 — next steps */}
      <Card>
        <CardHead title="Next steps" sub="In order" />
        <ol className="grid gap-3 px-5 py-5 sm:grid-cols-2">
          {[
            { t: 'Review scheme eligibility', d: 'Read the full criteria on the official portal and confirm nothing has changed.', to: '/eligibility' },
            { t: 'Review repayment estimate', d: 'Adjust the loan amount and check the month-by-month schedule.', to: '/repayment' },
            { t: 'Contact the authorized partner', d: `Call or visit ${partner ? partner.name : 'the handling institution'} and confirm they process this scheme.`, to: '/partners' },
            { t: 'Verify current scheme terms', d: 'Rates, ceilings and guidelines change — the official portal is always authoritative.', to: '/about' },
          ].map((s, i) => (
            <li key={s.t}>
              <Link to={s.to} className="card-flat flex items-start gap-3 transition hover:border-ink-400">
                <span className="tnum flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[12px] font-bold text-white">{i + 1}</span>
                <span>
                  <span className="block text-[13.5px] font-semibold text-ink-900">{s.t}</span>
                  <span className="block text-[12px] leading-snug text-ink-500">{s.d}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Card>

      {/* disclaimer */}
      <Banner tone="warn" title="VentureSetu provides scheme matching and repayment estimates. It does not guarantee loan approval, funding availability or disbursement.">
        All figures come from prototype data; only the concerned authority and the lending institution can
        confirm current terms.
      </Banner>
      <div className="flex items-start gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5">
        <ShieldAlert size={17} className="mt-0.5 shrink-0 text-saffron-600" />
        <p className="text-[12.5px] leading-relaxed text-ink-600">
          <strong className="font-semibold text-ink-800">Fraud reminder:</strong> never pay anyone who claims they
          can "confirm" your scheme loan. Official applications are free; decisions arrive only from the lending
          institution in writing.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white px-5 py-4">
        <p className="text-[13px] text-ink-600">Want to compare a different route?</p>
        <Btn variant="outline" onClick={() => { store.selectScheme(null); navigate('/eligibility'); }}>
          Re-run eligibility
        </Btn>
      </div>
    </div>
  );
}
