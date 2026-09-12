import { Check, X } from 'lucide-react';
import type { Criterion } from '../lib/types';

/* ============================================================
   "Why this matches" list — checkmarks for satisfied criteria,
   ✕ for unmet ones, ~ for partials. Every line is explainable.
   ============================================================ */

export default function EligibilityReason({ criteria, compact = false }: { criteria: Criterion[]; compact?: boolean }) {
  return (
    <ul className={compact ? 'space-y-1.5' : 'space-y-2.5'}>
      {criteria.map(c => {
        const ok = c.status === 'meets';
        const partial = c.status === 'partial';
        return (
          <li key={c.id} className="flex gap-2.5">
            <span
              className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-white`}
              style={{
                width: 18,
                height: 18,
                background: ok ? '#2f9e63' : partial ? '#d9a02e' : '#d95c68',
              }}
              aria-hidden
            >
              {ok ? <Check size={11} strokeWidth={3} /> : partial ? <span className="text-[10px] font-bold">~</span> : <X size={11} strokeWidth={3} />}
            </span>
            <div className="min-w-0">
              <span className={`text-[12.5px] font-semibold ${ok ? 'text-ink-800' : partial ? 'text-ink-700' : 'text-ink-800'}`}>
                {c.label} {ok ? 'matched' : partial ? 'to confirm' : 'not satisfied'}
              </span>
              <p className="text-[11.5px] leading-snug text-ink-500">{c.detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
