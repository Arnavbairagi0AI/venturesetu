import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ClipboardList, Info, Sparkles } from 'lucide-react';
import { Banner, Btn, Card, Chip } from '../components/ui';
import SchemeCard from '../components/SchemeCard';
import { recommendSchemes, profileValid } from '../lib/eligibility';
import { useProfileStore } from '../lib/profileStore';

/* ============================================================
   Step 2 — Eligibility results. Cards for every catalogued
   scheme; eligible ones carry "Why this matches" checkmarks,
   ineligible ones show ✕ Requirement not satisfied. All from
   local prototype data — never real-time decisions.
   ============================================================ */

export default function Eligibility() {
  const store = useProfileStore();
  const { profile, selectedSchemeId } = store;
  const valid = profileValid(profile);

  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const matches = useMemo(() => (valid ? recommendSchemes(profile) : []), [valid, profile]);

  // brief computed-matching pause on first arrival for demo feel
  useEffect(() => {
    if (!valid) return;
    setLoading(true);
    const t = setTimeout(() => { setLoading(false); setRevealed(true); }, 700);
    return () => clearTimeout(t);
  }, [valid]);

  const eligible = matches.filter(m => m.status !== 'not-eligible');
  const notEligible = matches.filter(m => m.status === 'not-eligible');

  const choose = (id: string) => {
    store.selectScheme(id);
    store.markComplete('eligibility');
  };

  if (!valid) {
    return (
      <div className="space-y-5">
        <h1 className="text-[22px] font-bold tracking-tight text-ink-900">Eligibility results</h1>
        <Card className="border-saffron-300 bg-saffron-50">
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-saffron-600">
                <ClipboardList size={20} />
              </span>
              <div>
                <h2 className="text-[15px] font-bold text-ink-900">Complete your applicant profile first</h2>
                <p className="mt-0.5 max-w-md text-[13px] text-ink-600">
                  Education, project type, cost, loan amount and location are needed to check scheme rules.
                </p>
              </div>
            </div>
            <Link to="/profile"><Btn size="lg">Fill the profile <ArrowRight size={16} /></Btn></Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5 text-[22px] font-bold tracking-tight text-ink-900">
            <Sparkles size={22} className="text-saffron-500" /> Eligibility results
          </h1>
          <p className="mt-1 max-w-3xl text-[13.5px] leading-relaxed text-ink-600">
            Checked against <strong className="font-semibold text-ink-800">prototype scheme data</strong> — these
            are not real-time government decisions. Verify current scheme terms with the concerned authority.
          </p>
        </div>
        <Link to="/profile" className="btn-outline flex items-center gap-2 px-4 py-2.5 text-[13.5px]">
          <ArrowLeft size={14} /> Edit profile
        </Link>
      </header>

      {/* profile summary strip */}
      <Card className="px-5 py-3.5">
        <div className="tnum flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
          <span className="font-semibold text-ink-900">{profile.location}</span>
          <span className="text-ink-300">·</span>
          <span className="text-ink-600">{profile.projectType.replace('-', ' ')}</span>
          <span className="text-ink-300">·</span>
          <span className="text-ink-600">project ₹{profile.projectCostL}L</span>
          <span className="text-ink-300">·</span>
          <span className="font-medium text-ink-800">loan ₹{profile.requiredLoanL}L</span>
        </div>
      </Card>

      {/* loading state */}
      {loading && (
        <Card className="px-5 py-10 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-ink-100 border-t-saffron-400" style={{ animation: 'spin 0.9s linear infinite' }} />
          <p className="mt-3 text-[13.5px] font-semibold text-ink-700">Checking your profile against scheme requirements…</p>
          <p className="text-[12px] text-ink-400">Running local prototype rules — nothing is sent anywhere.</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </Card>
      )}

      {/* results */}
      {!loading && revealed && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-[16px] font-bold text-ink-900">Your matches</h2>
            <Chip tone="green">{eligible.length} eligible / partial</Chip>
            <Chip tone="rose">{notEligible.length} not eligible</Chip>
            <Chip>{matches.length} in prototype catalogue</Chip>
          </div>

          {selectedSchemeId && (
            <Banner tone="ok" title="Scheme selected — continue to the repayment estimate.">
              Your choice is carried into the calculator, partner locator and final recommendation.
            </Banner>
          )}

          <div className="space-y-4">
            {eligible.map(m => (
              <SchemeCard
                key={m.scheme.id}
                match={m}
                selected={selectedSchemeId === m.scheme.id}
                onSelect={() => choose(m.scheme.id)}
              />
            ))}
          </div>

          {notEligible.length > 0 && (
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-[13.5px] font-semibold text-ink-600 hover:text-ink-900">
                <Info size={15} />
                {notEligible.length} scheme(s) not matched — show why
              </summary>
              <div className="mt-3 space-y-4">
                {notEligible.map(m => (
                  <SchemeCard key={m.scheme.id} match={m} selected={false} onSelect={() => {}} />
                ))}
              </div>
            </details>
          )}

          <Card className="border-saffron-300 bg-saffron-50">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-saffron-600">
                  <ArrowRight size={18} />
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-ink-900">Next: estimated repayment</h3>
                  <p className="text-[12.5px] text-ink-600">
                    {selectedSchemeId ? 'Your selected scheme pre-fills interest, tenure and moratorium.' : 'Select a scheme above to pre-fill the calculator.'}
                  </p>
                </div>
              </div>
              <Link to="/repayment">
                <Btn disabled={!selectedSchemeId}>Continue to repayment <ArrowRight size={15} /></Btn>
              </Link>
            </div>
          </Card>

          <p className="text-[11.5px] leading-relaxed text-ink-400">
            Based on prototype scheme data · Verify current scheme terms with the concerned authority ·
            VentureSetu does not claim these results are real-time government decisions.
          </p>
        </>
      )}
    </div>
  );
}
