import {
  BookOpenCheck, ShieldAlert, ExternalLink, Info, Lock, Compass,
} from 'lucide-react';
import { Banner, Card, CardHead, Chip } from '../components/ui';
import { SCHEMES } from '../data/schemes';
import { PARTNERS } from '../data/partners';

export default function About() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[22px] font-bold tracking-tight text-ink-900">About VentureSetu</h1>
        <p className="mt-1 max-w-3xl text-[13.5px] leading-relaxed text-ink-600">
          VentureSetu is a <strong className="font-semibold text-ink-800">decision-support prototype</strong> built
          for the Smart India Hackathon. It helps first-generation and marginalized entrepreneurs prepare for
          scheme-linked enterprise finance — by organising public information, explaining trade-offs, and
          pointing to where official verification happens.
        </p>
      </header>

      <Banner tone="warn" title="What VentureSetu is NOT.">
        It is not a lender, not a government portal, and not an application channel. It does not approve,
        guarantee, or intermediate any loan. No result on this site is an offer of credit. Final eligibility is
        decided only by the lending institution or implementing agency under the scheme's current guidelines.
      </Banner>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="What it does" sub="Decision support, end to end" />
          <ul className="space-y-2.5 px-5 py-4 text-[13px] leading-relaxed text-ink-600">
            <li className="flex gap-2.5"><Compass size={16} className="mt-0.5 shrink-0 text-ink-900" /> Captures an applicant profile relevant to Indian enterprise-support schemes.</li>
            <li className="flex gap-2.5"><Compass size={16} className="mt-0.5 shrink-0 text-ink-900" /> Produces an explainable shortlist of scheme categories with per-criteria reasoning.</li>
            <li className="flex gap-2.5"><Compass size={16} className="mt-0.5 shrink-0 text-ink-900" /> Models repayment (EMI, moratorium, fee, subsidy) and checks it against your stated surplus.</li>
            <li className="flex gap-2.5"><Compass size={16} className="mt-0.5 shrink-0 text-ink-900" /> Describes the institutions that typically handle these files, with verify-first guidance.</li>
          </ul>
        </Card>
        <Card>
          <CardHead title="What it deliberately avoids" sub="By design" />
          <ul className="space-y-2.5 px-5 py-4 text-[13px] leading-relaxed text-ink-600">
            <li className="flex gap-2.5"><ShieldAlert size={16} className="mt-0.5 shrink-0 text-saffron-600" /> No approvals, sanctions, "guaranteed loans" or approval-probability scores.</li>
            <li className="flex gap-2.5"><ShieldAlert size={16} className="mt-0.5 shrink-0 text-saffron-600" /> No claims of partnership with any bank, ministry or scheme.</li>
            <li className="flex gap-2.5"><ShieldAlert size={16} className="mt-0.5 shrink-0 text-saffron-600" /> No logins, no document uploads, no data leaving the browser.</li>
            <li className="flex gap-2.5"><ShieldAlert size={16} className="mt-0.5 shrink-0 text-saffron-600" /> No agent referrals or fee-based facilitation of any kind.</li>
          </ul>
        </Card>
      </div>

      <Card>
        <CardHead title="How the matching works" sub="Transparent by construction" />
        <div className="grid gap-6 px-5 py-5 lg:grid-cols-2">
          <div className="space-y-3 text-[13px] leading-relaxed text-ink-600">
            <p>
              Each scheme in the catalogue contributes a small set of <strong className="font-semibold text-ink-800">criteria</strong>
              {' '}derived from its publicly described focus — who it serves, ticket sizes, and structural conditions.
              Your profile is checked against each criterion and the criterion is marked:
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip tone="green">Meets</Chip>
              <Chip tone="saffron">Partial</Chip>
              <Chip tone="rose">Gap</Chip>
              <Chip>Note</Chip>
            </div>
            <p>
              The score is the share of assessable criteria satisfied (partial counts half; informational notes are
              excluded). Some criteria are <strong className="font-semibold text-ink-800">hard requirements</strong> — if
              unmet, the scheme is dropped from the shortlist entirely rather than merely scored down.
            </p>
            <p>
              The rules are deliberately simple and readable. Every result can be traced line by line and checked
              against the official guidelines — which is exactly what an applicant should do before acting.
            </p>
          </div>
          <div className="card-flat p-5 text-[13px] leading-relaxed text-ink-600">
            <h4 className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-400">Prototype scope</h4>
            <ul className="list-disc space-y-1.5 pl-4">
              <li>Catalogue summarises {SCHEMES.length} scheme categories and {PARTNERS.length} institution types.</li>
              <li>All computation and storage are local to your browser (localStorage only).</li>
              <li>Amounts are indicative and frequently revised — the official portal is always authoritative.</li>
              <li>A production build would sync guideline text from official RSS/API feeds with dated provenance for each criterion.</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <CardHead title="Official sources" sub="Start verification here — only these portals are authoritative" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-ink-200 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                <th className="px-5 py-2.5">Programme</th>
                <th className="px-5 py-2.5">Implementing network</th>
                <th className="px-5 py-2.5">Official portal</th>
              </tr>
            </thead>
            <tbody>
              {SCHEMES.map(s => (
                <tr key={s.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-5 py-3 font-semibold text-ink-800">{s.name}</td>
                  <td className="px-5 py-3 text-ink-600">{s.category}</td>
                  <td className="px-5 py-3">
                    <a href={s.officialSource} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1.5">
                      {s.officialSource.replace(/^https?:\/\//, '')} <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHead title={<span className="flex items-center gap-2"><Lock size={15} /> Privacy</span>} sub="Local-only by design" />
          <div className="px-5 py-4 text-[13px] leading-relaxed text-ink-600">
            Your profile, loan assumptions and progress are stored in your browser's localStorage. Nothing is
            transmitted to any server — there is no backend in this prototype. Use the "Reset" button on the
            Applicant Profile page to erase stored data.
          </div>
        </Card>
        <Card>
          <CardHead title={<span className="flex items-center gap-2"><Info size={15} /> Accuracy & maintenance</span>} sub="Prototype caveat" />
          <div className="px-5 py-4 text-[13px] leading-relaxed text-ink-600">
            Scheme names, bands and subsidy percentages are summarised from public materials and may be outdated.
            Where a figure has been revised in recent budgets, we say "commonly quoted" and link the portal that
            carries the current text. Treat every number here as a prompt to verify, never as the rule itself.
          </div>
        </Card>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5">
        <BookOpenCheck size={17} className="mt-0.5 shrink-0 text-ink-900" />
        <p className="text-[12.5px] leading-relaxed text-ink-600">
          Built as a Smart India Hackathon prototype. Feedback from district officials, bankers and SHG
          federations would shape the production roadmap: guideline-sync with dated provenance, multilingual
          support, and offline-first delivery for low-connectivity districts.
        </p>
      </div>
    </div>
  );
}
