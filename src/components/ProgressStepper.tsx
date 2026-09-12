import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { JOURNEY_STEPS, useProfileStore } from '../lib/profileStore';
import { profileValid } from '../lib/eligibility';

/* ============================================================
   Progress indicator: Profile → Eligibility → Repayment →
   Partner → Recommendation. Shown under the header on every
   page; reacts to client-side route changes.
   ============================================================ */

export default function ProgressStepper() {
  const { completed, profile } = useProfileStore();
  const loc = useLocation();

  const profileDone = profileValid(profile);
  // No step is "current" on the dashboard or About pages.
  const current = JOURNEY_STEPS.findIndex(s => s.to !== '/' && loc.pathname.startsWith(s.to));

  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-2 text-[12px]" aria-label="Journey progress">
      {JOURNEY_STEPS.map((s, i) => {
        const done = s.id === 'profile' ? profileDone : s.id === 'recommendation' ? (completed.partner ?? false) : (completed[s.id] ?? false);
        const isCurrent = i === current;
        return (
          <li key={s.id} className="flex items-center">
            <Link
              to={s.to}
              aria-current={isCurrent ? 'step' : undefined}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${
                isCurrent
                  ? 'bg-ink-900 text-white'
                  : done
                    ? 'text-teal-600 hover:bg-teal-50'
                    : 'text-ink-400 hover:bg-ink-100'
              }`}
            >
              <span
                className={`flex items-center justify-center rounded-full text-[9.5px] font-bold ${
                  isCurrent ? 'bg-white text-ink-900' : done ? 'bg-teal-400 text-white' : 'bg-ink-200 text-ink-500'
                }`}
                style={{ width: 18, height: 18 }}
              >
                {done && !isCurrent ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </Link>
            {i < JOURNEY_STEPS.length - 1 && <ChevronRight size={13} className="mx-0.5 text-ink-300" />}
          </li>
        );
      })}
    </ol>
  );
}
