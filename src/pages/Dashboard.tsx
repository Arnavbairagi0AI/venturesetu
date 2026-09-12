import { Link } from 'react-router-dom';
import {
  ClipboardList, Sparkles, Calculator, MapPin, FileCheck2, ArrowRight,
  ShieldAlert, Landmark, Users, GraduationCap, UserRound,
} from 'lucide-react';
import { Banner, Btn, Card, CardHead, Chip } from '../components/ui';
import { JOURNEY_STEPS, useProfileStore } from '../lib/profileStore';
import { profileValid } from '../lib/eligibility';
import { SCHEMES } from '../data/schemes';
import { PARTNERS } from '../data/partners';

const STEP_ICONS = [UserRound, Sparkles, FileCheck2, Calculator, MapPin, FileCheck2];

/* ============================================================ hero */
function Hero() {
  const { profile, completed } = useProfileStore();
  const ready = profileValid(profile);
  const isDone = (id: typeof JOURNEY_STEPS[number]['id']) =>
    id === 'profile' ? ready : id === 'recommendation' ? false : completed[id];
  const doneCount = JOURNEY_STEPS.filter(s => isDone(s.id)).length;

  return (
    <section className="hero-navy overflow-hidden rounded-2xl">
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <Chip tone="saffron">Smart India Hackathon prototype</Chip>
          <h1 className="mt-4 text-[30px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[38px]">
            VentureSetu
            <span className="mt-2 block text-[19px] font-semibold leading-snug text-saffron-300 sm:text-[21px]">
              AI-Driven Scheme Matching for Marginalized Entrepreneurs
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-white/80">
            Find the right scheme, understand your repayment, and reach the right authorized partner.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/profile">
              <Btn variant="accent" size="lg">Check Eligibility <ArrowRight size={16} /></Btn>
            </Link>
            <Link to="/about">
              <Btn variant="outlineLight" size="lg">Explore How It Works</Btn>
            </Link>
          </div>
        </div>

        {/* mini journey tracker */}
        <div className="rounded-2xl border border-white/15 bg-white/[.07] p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[13.5px] font-semibold text-white">Your journey</h2>
            <span className="tnum text-[12px] font-semibold text-white/60">{doneCount}/{JOURNEY_STEPS.length} steps</span>
          </div>
          <ol className="mt-4 space-y-2.5">
            {JOURNEY_STEPS.map((s, i) => {
              const done = isDone(s.id);
              const Icon = STEP_ICONS[i];
              return (
                <li key={s.id}>
                  <Link to={s.to} className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-white/10">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                      done ? 'bg-teal-400 text-white' : 'bg-white/10 text-white/70'
                    }`}>
                      {done ? '✓' : <Icon size={14} />}
                    </span>
                    <span className={`text-[13px] font-medium ${done ? 'text-white' : 'text-white/65'}`}>{s.label}</span>
                    <ArrowRight size={14} className="ml-auto text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ==================================================== 3-step visual */
function ThreeSteps() {
  const steps = [
    {
      icon: ClipboardList,
      title: 'Check Eligibility',
      desc: 'Answer a short profile and see which scheme categories fit — with reasons for every match.',
      to: '/profile',
    },
    {
      icon: Calculator,
      title: 'Calculate Repayment',
      desc: 'Estimate EMI, total interest and repayment timeline before you commit.',
      to: '/repayment',
    },
    {
      icon: MapPin,
      title: 'Find Authorized Partner',
      desc: 'Locate the institutions that handle these files, district by district.',
      to: '/partners',
    },
  ];
  return (
    <section aria-label="How VentureSetu works in three steps">
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link key={s.title} to={s.to} className="group">
              <Card className="h-full border-t-[3px] border-t-saffron-400 transition hover:-translate-y-0.5 hover:shadow-pop">
                <div className="px-5 py-5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-white">
                      <Icon size={19} />
                    </span>
                    <span className="tnum text-[26px] font-extrabold leading-none text-ink-200">0{i + 1}</span>
                  </div>
                  <h3 className="mt-3.5 text-[15px] font-bold tracking-tight text-ink-900">{s.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-600">{s.desc}</p>
                  <span className="mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-900 transition-all group-hover:gap-2.5">
                    Start <ArrowRight size={13} />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      {/* the three questions this product answers, mapped to the steps above */}
      <div className="mt-3 hidden items-center justify-center gap-2 text-[12px] font-medium text-ink-400 md:flex" aria-hidden>
        <span>Can I qualify?</span>
        <ArrowRight size={13} />
        <span>What will I repay?</span>
        <ArrowRight size={13} />
        <span>Where should I go?</span>
      </div>
    </section>
  );
}

/* ==================================================== feature cards */
function FeatureCards() {
  const features = [
    {
      icon: Sparkles,
      title: 'Eligibility Recommender',
      desc: 'Find schemes based on your profile and understand why you match.',
      cta: 'Check eligibility',
      to: '/profile',
    },
    {
      icon: Calculator,
      title: 'Repayment Calculator',
      desc: 'Estimate EMI, total interest and repayment timeline.',
      cta: 'Estimate repayment',
      to: '/repayment',
    },
    {
      icon: MapPin,
      title: 'Partner Locator',
      desc: 'Find authorized channel partners based on scheme and location.',
      cta: 'Find partners',
      to: '/partners',
    },
  ];
  return (
    <section aria-label="Core features">
      <div className="grid gap-4 md:grid-cols-3">
        {features.map(f => {
          const Icon = f.icon;
          return (
            <Card key={f.title}>
              <CardHead
                title={
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-900">
                      <Icon size={17} />
                    </span>
                    {f.title}
                  </span>
                }
              />
              <div className="flex h-[calc(100%-61px)] flex-col px-5 py-4">
                <p className="text-[13px] leading-relaxed text-ink-600">{f.desc}</p>
                <Link to={f.to} className="link mt-auto inline-flex items-center gap-1.5 pt-3 text-[12.5px]">
                  {f.cta} <ArrowRight size={13} />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

/* ==================================================== extras */
function StatsStrip() {
  const creditSchemes = SCHEMES.filter(s => s.category === 'Credit' || s.category === 'Credit + subsidy').length;
  const supportSchemes = SCHEMES.length - creditSchemes;
  return (
    <Card>
      <CardHead title="What is inside the catalogue" sub="Informational summaries only — amounts change; always verify" />
      <div className="grid gap-px overflow-hidden rounded-b-2xl bg-ink-200 sm:grid-cols-3">
        <div className="flex items-center gap-4 bg-white px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-50 text-ink-900"><Landmark size={19} /></span>
          <div>
            <div className="tnum text-[20px] font-bold text-ink-900">{creditSchemes}</div>
            <div className="text-[12px] text-ink-500">credit & credit+subsidy routes summarised</div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-50 text-ink-900"><GraduationCap size={19} /></span>
          <div>
            <div className="tnum text-[20px] font-bold text-ink-900">{supportSchemes}</div>
            <div className="text-[12px] text-ink-500">skill, market-access & cluster programmes</div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-50 text-ink-900"><Users size={19} /></span>
          <div>
            <div className="tnum text-[20px] font-bold text-ink-900">{PARTNERS.length}</div>
            <div className="text-[12px] text-ink-500">institution types in the partner locator</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SafetyNote() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5">
      <ShieldAlert size={17} className="mt-0.5 shrink-0 text-saffron-600" />
      <p className="text-[12.5px] leading-relaxed text-ink-600">
        <strong className="font-semibold text-ink-800">Safety note:</strong> no government scheme charges a
        fee through private agents, and no official communicates loan approval over WhatsApp. If someone
        promises a guaranteed sanction for money, treat it as fraud and report it to your district's scheme
        help desk or the national cybercrime portal.
      </p>
    </div>
  );
}

/* ============================================================ page */
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <Hero />
      <ThreeSteps />
      <FeatureCards />
      <Banner tone="warn" title="VentureSetu is a decision-support prototype and does not guarantee loan approval or funding.">
        It organises public information so you know what to verify, where to ask, and what the monthly
        commitment could look like — final decisions rest with banks, agencies and government departments.
      </Banner>
      <StatsStrip />
      <SafetyNote />
    </div>
  );
}
