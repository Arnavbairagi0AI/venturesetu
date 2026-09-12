import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Btn, Card, Chip } from './ui';
import EligibilityReason from './EligibilityReason';
import type { SchemeMatch } from '../lib/types';

/* ============================================================
   Scheme result card — name, category, loan range, interest,
   tenure, moratorium, eligibility status, "Why this matches"
   with checkmarks, prototype-data notices and Select Scheme.
   ============================================================ */

const STATUS_META = {
  eligible: { icon: CheckCircle2, chip: 'chip-green', label: 'Eligible' },
  'partially-eligible': { icon: AlertCircle, chip: 'chip-saffron', label: 'Partially eligible' },
  'not-eligible': { icon: XCircle, chip: 'chip-rose', label: 'Not eligible' },
} as const;

export default function SchemeCard({ match, selected, onSelect }: {
  match: SchemeMatch;
  selected: boolean;
  onSelect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const m = match;
  const meta = STATUS_META[m.status];
  const StatusIcon = meta.icon;
  const eligible = m.status !== 'not-eligible';
  const [minL, maxL] = m.scheme.terms.loanRangeL;

  return (
    <Card className={selected ? 'border-teal-400 shadow-pop' : ''}>
      <div className="flex flex-wrap items-start gap-4 border-b border-ink-200 px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15.5px] font-bold tracking-tight text-ink-900">{m.scheme.name}</h3>
            <Chip>{m.scheme.category}</Chip>
          </div>
          {/* terms row */}
          <dl className="tnum mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px] sm:grid-cols-4">
            <div>
              <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">Loan range</dt>
              <dd className="font-semibold text-ink-800">₹{minL}L – ₹{maxL}L</dd>
            </div>
            <div>
              <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">Interest</dt>
              <dd className="font-semibold text-ink-800">{m.scheme.terms.interestRatePct > 0 ? `${m.scheme.terms.interestRatePct}% p.a.` : 'Nil (training)'}</dd>
            </div>
            <div>
              <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">Tenure</dt>
              <dd className="font-semibold text-ink-800">{m.scheme.terms.tenureMonths} months</dd>
            </div>
            <div>
              <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">Moratorium</dt>
              <dd className="font-semibold text-ink-800">{m.scheme.terms.moratoriumMonths > 0 ? `${m.scheme.terms.moratoriumMonths} mo` : 'None'}</dd>
            </div>
          </dl>
        </div>
        <span className={`chip ${meta.chip} shrink-0`}>
          <StatusIcon size={14} /> {meta.label}
        </span>
      </div>

      <div className="px-5 py-4">
        {eligible ? (
          <>
            <button
              onClick={() => setOpen(o => !o)}
              className="flex w-full items-center justify-between gap-2 rounded-[10px] bg-ink-50 px-3.5 py-2.5 text-left text-[13px] font-semibold text-ink-800 transition hover:bg-ink-100"
              aria-expanded={open}
            >
              Why this matches
              {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {open && (
              <div className="mt-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5">
                <EligibilityReason criteria={m.criteria} />
                <div className="mt-3 border-t border-ink-100 pt-2.5">
                  <p className="text-[11px] text-ink-400">Score: {m.score}% of requirements satisfied (prototype rules).</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border px-4 py-3.5" style={{ borderColor: '#f6cfcf', background: '#fdeeee' }}>
            <p className="text-[12.5px] font-bold" style={{ color: '#b23a48' }}>Not eligible under prototype rules</p>
            <div className="mt-2">
              <EligibilityReason criteria={m.criteria.filter(c => c.status !== 'meets')} compact />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {eligible && (
            <Btn variant={selected ? 'outline' : 'primary'} onClick={onSelect} disabled={selected}>
              {selected ? '✓ Scheme selected' : 'Select Scheme'}
            </Btn>
          )}
          <a href={m.scheme.officialSource} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1.5 text-[12px]">
            Official portal <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </Card>
  );
}
