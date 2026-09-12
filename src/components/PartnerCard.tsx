import { useState } from 'react';
import { MapPin, Phone, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { Btn, Card, Chip } from './ui';
import { schemeById } from '../data/schemes';
import type { Partner } from '../lib/types';

/* ============================================================
   Partner card — name, type, authorized schemes, location, mock
   distance, contact, authorization status, and a clearly
   labelled prototype capacity indicator (NOT live data).
   ============================================================ */

const AUTH_META: Record<Partner['authorization'], { label: string; cls: string }> = {
  authorized: { label: 'Authorized', cls: 'chip-green' },
  empanelled: { label: 'Empanelled', cls: 'chip-teal' },
  referral: { label: 'Referral desk', cls: 'chip-saffron' },
};

export default function PartnerCard({ partner, onViewDetails }: { partner: Partner; onViewDetails: () => void }) {
  const [open, setOpen] = useState(false);
  const auth = AUTH_META[partner.authorization];
  const cap = Math.max(0, Math.min(100, partner.capacityPct));
  const capTone = cap >= 70 ? '#2f9e63' : cap >= 45 ? '#e9b949' : '#d95c68';

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-200 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-900">
            <Building2 size={17} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-bold leading-snug tracking-tight text-ink-900">{partner.name}</h3>
            <p className="text-[12px] text-ink-500">{partner.type}</p>
          </div>
        </div>
        <span className={`chip ${auth.cls} shrink-0`}>{auth.label}</span>
      </div>

      <div className="space-y-3 px-5 py-4">
        <div className="tnum grid grid-cols-2 gap-3 text-[12.5px] sm:grid-cols-3">
          <div className="flex items-center gap-1.5 text-ink-700">
            <MapPin size={13} className="shrink-0 text-ink-400" /> {partner.location}
          </div>
          <div className="text-ink-700"><span className="font-semibold">{partner.distanceKm} km</span> <span className="text-ink-400">(mock)</span></div>
          <div className="flex items-center gap-1.5 text-ink-700 sm:col-span-1 col-span-2">
            <Phone size={13} className="shrink-0 text-ink-400" /> <span className="truncate">{partner.contact}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {partner.authorizedSchemeIds.map(id => (
            <Chip key={id} tone="teal">{schemeById(id)?.name ?? id}</Chip>
          ))}
        </div>

        {/* capacity — explicitly labelled as prototype data */}
        <div className="card-flat px-3.5 py-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-ink-500">
            <span>Prototype indicator — not live data</span>
            <span className="tnum">{cap}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-200">
            <div className="h-full rounded-full" style={{ width: `${cap}%`, background: capTone }} />
          </div>
          <p className="mt-1 text-[10.5px] text-ink-400">Indicative workload band for the demo. Never shows funding availability.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Btn size="sm" onClick={onViewDetails}>View Partner Details</Btn>
          <button
            onClick={() => setOpen(o => !o)}
            className="btn-outline flex items-center gap-1.5 px-3 py-1.5 text-[12px]"
            aria-expanded={open}
          >
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />} How to approach
          </button>
        </div>

        {open && (
          <div className="rounded-xl border border-saffron-300 bg-saffron-50 px-3.5 py-3 text-[12px] leading-relaxed" style={{ color: '#6b4e0a' }}>
            <strong className="font-semibold">Verify before visiting:</strong> confirm the branch, officer and
            current scheme tie-up through the institution's own website or the District Industries Centre.
            No genuine partner asks for cash to "arrange" a scheme loan.
          </div>
        )}
      </div>
    </Card>
  );
}
