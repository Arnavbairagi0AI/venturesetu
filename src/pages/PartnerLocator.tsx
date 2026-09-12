import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Map as MapIcon, Search } from 'lucide-react';
import { Banner, Btn, Card, Chip, Input, Modal, Select } from '../components/ui';
import PartnerCard from '../components/PartnerCard';
import { PARTNERS } from '../data/partners';
import { schemeById } from '../data/schemes';
import { useProfileStore } from '../lib/profileStore';
import type { Partner } from '../lib/types';

/* ============================================================
   Step 4 — Partner locator. Filters (scheme / type / location),
   mock-distance sort, labelled map placeholder, and a details
   modal. No GPS, no Maps API, no live availability claims.
   ============================================================ */

const PARTNER_TYPES: Partner['type'][] = [
  'Public sector bank', 'Private bank', 'NBFC', 'Training institute (RSETI)',
  'Handholding agency', 'Regional office',
];

export default function PartnerLocator() {
  const store = useProfileStore();
  const { selectedSchemeId } = store;
  const navigate = useNavigate();

  const [schemeFilter, setSchemeFilter] = useState<string>(selectedSchemeId ?? 'all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [locFilter, setLocFilter] = useState<string>('all');
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState<Partner | null>(null);

  const locations = useMemo(() => [...new Set(PARTNERS.map(p => p.location))].sort(), []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PARTNERS
      .filter(p => schemeFilter === 'all' || p.authorizedSchemeIds.includes(schemeFilter))
      .filter(p => typeFilter === 'all' || p.type === typeFilter)
      .filter(p => locFilter === 'all' || p.location === locFilter)
      .filter(p => !needle || `${p.name} ${p.location}`.toLowerCase().includes(needle))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [schemeFilter, typeFilter, locFilter, q]);

  const chooseAndContinue = (p: Partner) => {
    store.selectPartner(p.id);
    store.markComplete('partner');
    setDetail(null);
    navigate('/recommendation');
  };

  const schemeName = (id: string) => schemeById(id)?.name ?? id;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5 text-[22px] font-bold tracking-tight text-ink-900">
            <MapPin size={22} className="text-ink-900" /> Partner locator
          </h1>
          <p className="mt-1 max-w-3xl text-[13.5px] leading-relaxed text-ink-600">
            Institutions that process the selected schemes, sorted by mock distance from your district.
            Contacts and tie-ups change — <strong className="font-semibold text-ink-800">always verify through the institution's own channels</strong>.
          </p>
        </div>
        <Link to="/repayment" className="btn-outline flex items-center gap-2 px-4 py-2.5 text-[13.5px]">
          <ArrowLeft size={14} /> Back to repayment
        </Link>
      </header>

      {/* filters */}
      <Card className="px-5 py-4">
        <div className="grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
          <Select value={schemeFilter} onChange={e => setSchemeFilter(e.target.value)} aria-label="Filter by scheme">
            <option value="all">All authorized schemes</option>
            {selectedSchemeId && <option value={selectedSchemeId}>My selected scheme</option>}
            {[...new Set(PARTNERS.flatMap(p => p.authorizedSchemeIds))]
              .filter(id => id !== selectedSchemeId)
              .map(id => (
                <option key={id} value={id}>{schemeName(id)}</option>
              ))}
          </Select>
          <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} aria-label="Filter by partner type">
            <option value="all">All partner types</option>
            {PARTNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select value={locFilter} onChange={e => setLocFilter(e.target.value)} aria-label="Filter by location">
            <option value="all">All locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </Select>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="pl-9" aria-label="Search partners" />
          </div>
        </div>
      </Card>

      {/* map placeholder */}
      <Card className="overflow-hidden">
        <div
          className="relative flex h-44 items-center justify-center"
          style={{
            background:
              'linear-gradient(rgba(18,60,99,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(18,60,99,.05) 1px, transparent 1px), #f2f6fa',
            backgroundSize: '26px 26px, 26px 26px, auto',
          }}
          aria-label="Map placeholder"
        >
          <div className="flex flex-col items-center gap-1.5 text-center">
            <MapIcon size={22} className="text-ink-300" />
            <p className="text-[13px] font-semibold text-ink-500">Map integration — future implementation</p>
            <p className="text-[11.5px] text-ink-400">Distance sorting already works with mock values.</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-auto text-[15px] font-bold text-ink-900">
          {filtered.length} partner{filtered.length === 1 ? '' : 's'} · sorted by distance
        </h2>
        {schemeFilter !== 'all' && <Chip tone="teal">{schemeName(schemeFilter)}</Chip>}
      </div>

      {/* results */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map(p => (
          <PartnerCard key={p.id} partner={p} onViewDetails={() => setDetail(p)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="px-5 py-12 text-center">
          <p className="text-[14px] font-semibold text-ink-700">No partners match these filters.</p>
          <p className="mt-1 text-[12.5px] text-ink-500">Try clearing the search or widening the scheme filter.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Btn variant="outline" onClick={() => { setSchemeFilter('all'); setTypeFilter('all'); setLocFilter('all'); setQ(''); }}>
              Clear filters
            </Btn>
          </div>
        </Card>
      )}

      <Banner tone="warn" title="No live funding availability is shown anywhere on this page.">
        The small workload bar is a prototype indicator — not live data. Always confirm scheme handling and
        current terms with the partner directly before travelling.
      </Banner>

      <Card className="border-saffron-300 bg-saffron-50">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-saffron-600">
              <ArrowRight size={18} />
            </span>
            <div>
              <h3 className="text-[14px] font-bold text-ink-900">Next: your final recommendation</h3>
              <p className="text-[12.5px] text-ink-600">One page combining scheme, repayment and partner.</p>
            </div>
          </div>
          <Btn onClick={() => { store.markComplete('partner'); navigate('/recommendation'); }}>
            View final recommendation <ArrowRight size={15} />
          </Btn>
        </div>
      </Card>

      {/* details modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name ?? ''}>
        {detail && (
          <div className="space-y-4 text-[13.5px] leading-relaxed text-ink-700">
            <div className="flex flex-wrap gap-2">
              <Chip>{detail.type}</Chip>
              <span className={`chip ${detail.authorization === 'authorized' ? 'chip-green' : detail.authorization === 'empanelled' ? 'chip-teal' : 'chip-saffron'}`}>
                {detail.authorization === 'authorized' ? 'Authorized' : detail.authorization === 'empanelled' ? 'Empanelled' : 'Referral desk'}
              </span>
            </div>
            <div className="tnum grid grid-cols-2 gap-3 text-[13px]">
              <div><span className="text-ink-400">Location:</span> <strong>{detail.location}</strong></div>
              <div><span className="text-ink-400">Distance:</span> <strong>{detail.distanceKm} km</strong> <span className="text-ink-400">(mock)</span></div>
              <div className="col-span-2"><span className="text-ink-400">Contact:</span> <strong>{detail.contact}</strong></div>
            </div>
            <div>
              <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">Authorized schemes</h4>
              <ul className="space-y-1">
                {detail.authorizedSchemeIds.map(id => <li key={id}>• {schemeName(id)}</li>)}
              </ul>
            </div>
            <div className="rounded-xl border border-saffron-300 bg-saffron-50 px-3.5 py-3 text-[12.5px]" style={{ color: '#6b4e0a' }}>
              Verify the branch and scheme tie-up through the institution's official website before visiting.
              Genuine partners never charge cash to arrange a scheme loan.
            </div>
            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <Btn variant="outline" onClick={() => setDetail(null)}>Close</Btn>
              <Btn onClick={() => chooseAndContinue(detail)}>Choose this partner & continue <ArrowRight size={14} /></Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
