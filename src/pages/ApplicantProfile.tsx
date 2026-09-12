import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardList, Lock } from 'lucide-react';
import { Banner, Btn, Card, CardHead, Chip, Field, Input, Select } from '../components/ui';
import {
  APPLICANT_CATEGORIES, EDUCATION_LEVELS, INCOME_BANDS, PROJECT_TYPES, STATES,
  type Profile,
} from '../lib/types';
import { useProfileStore } from '../lib/profileStore';
import { profileValid } from '../lib/eligibility';

/* ============================================================
   Step 1 — Applicant Profile. Exactly the seven spec'd fields.
   Local state validation; stored only in React/localStorage.
   No Aadhaar, PAN, OTP, passwords or any credentials collected.
   ============================================================ */

type Errors = Partial<Record<keyof Profile, string>>;

export default function ApplicantProfile() {
  const store = useProfileStore();
  const { profile } = store;
  const navigate = useNavigate();
  const [touched, setTouched] = useState<Partial<Record<keyof Profile, boolean>>>({});

  const valid = profileValid(profile);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => {
    store.setProfile({ [k]: v } as Partial<Profile>);
    setTouched(t => ({ ...t, [k]: true }));
  };

  const errors: Errors = {};
  if (touched.projectType && !profile.projectType) errors.projectType = 'Select your project type.';
  if (touched.projectCostL && profile.projectCostL <= 0) errors.projectCostL = 'Enter the estimated project cost.';
  if (touched.requiredLoanL && profile.requiredLoanL <= 0) errors.requiredLoanL = 'Enter the loan amount you need.';
  if (touched.requiredLoanL && profile.projectCostL > 0 && profile.requiredLoanL > profile.projectCostL) {
    errors.requiredLoanL = 'Loan needed can’t exceed the total project cost.';
  }
  if (touched.location && !profile.location) errors.location = 'Select your state.';
  if (touched.education && !profile.education) errors.education = 'Select your education level.';

  const err = (k: keyof Profile, ok: boolean) => (touched[k] && !ok ? 'border-[#d95c68] bg-[#fdf3f3]' : '');
  const ok = (k: keyof Profile, isOk: boolean) => (touched[k] && isOk ? 'border-[#2f9e63]' : '');

  const submit = () => {
    setTouched({ projectType: true, projectCostL: true, requiredLoanL: true, location: true, education: true });
    if (valid) {
      store.markComplete('profile');
      navigate('/eligibility');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5 text-[22px] font-bold tracking-tight text-ink-900">
            <ClipboardList size={22} className="text-ink-900" /> Applicant profile
          </h1>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-ink-600">
            Seven quick questions. The recommender checks these against each scheme's requirements — nothing is
            uploaded; answers stay in this browser.
          </p>
        </div>
        <Chip tone={valid ? 'green' : 'saffron'}>{valid ? 'Ready to check' : 'Fill all fields'}</Chip>
      </header>

      <Card>
        <CardHead
          title="Your details"
          sub="Fields marked * are required · no sensitive documents or credentials are collected"
        />
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1 — Applicant Category */}
          <Field label="Applicant category">
            <Select
              value={profile.applicantCategory}
              onChange={e => set('applicantCategory', e.target.value as Profile['applicantCategory'])}
            >
              {APPLICANT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </Field>

          {/* 2 — Annual Family Income */}
          <Field label="Annual family income" hint="used for income-ceiling checks">
            <Select
              value={profile.annualFamilyIncomeBand}
              onChange={e => set('annualFamilyIncomeBand', e.target.value as Profile['annualFamilyIncomeBand'])}
            >
              {INCOME_BANDS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </Select>
          </Field>

          {/* 3 — Education */}
          <Field label="Education" required error={touched.education && !profile.education ? 'Select your education level.' : undefined}>
            <Select
              className={`${err('education', !!profile.education)} ${ok('education', !!profile.education)}`}
              value={profile.education}
              onChange={e => set('education', e.target.value as Profile['education'])}
            >
              <option value="">Select education…</option>
              {EDUCATION_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </Select>
          </Field>

          {/* 4 — Project Type */}
          <Field label="Project type" required error={touched.projectType && !profile.projectType ? 'Select your project type.' : undefined}>
            <Select
              className={`${err('projectType', !!profile.projectType)} ${ok('projectType', !!profile.projectType)}`}
              value={profile.projectType}
              onChange={e => set('projectType', e.target.value)}
            >
              <option value="">Select project type…</option>
              {PROJECT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </Select>
          </Field>

          {/* 5 — Project Cost */}
          <Field label="Project cost" hint="₹ lakh" required error={touched.projectCostL && profile.projectCostL <= 0 ? 'Enter the estimated project cost.' : undefined}>
            <Input
              type="number" min={0} step={0.5} inputMode="decimal"
              className={`${err('projectCostL', profile.projectCostL > 0)} ${ok('projectCostL', profile.projectCostL > 0)}`}
              value={profile.projectCostL || ''}
              onChange={e => set('projectCostL', Math.max(0, Number(e.target.value) || 0))}
              placeholder="e.g. 8"
            />
          </Field>

          {/* 6 — Required Loan Amount */}
          <Field
            label="Required loan amount" hint="₹ lakh" required
            error={
              touched.requiredLoanL && profile.requiredLoanL <= 0
                ? 'Enter the loan amount you need.'
                : touched.requiredLoanL && profile.projectCostL > 0 && profile.requiredLoanL > profile.projectCostL
                  ? 'Loan needed can’t exceed the total project cost.'
                  : undefined
            }
          >
            <Input
              type="number" min={0} step={0.5} inputMode="decimal"
              className={`${err('requiredLoanL', profile.requiredLoanL > 0 && profile.requiredLoanL <= (profile.projectCostL || Infinity))} ${ok('requiredLoanL', profile.requiredLoanL > 0 && profile.requiredLoanL <= (profile.projectCostL || Infinity))}`}
              value={profile.requiredLoanL || ''}
              onChange={e => set('requiredLoanL', Math.max(0, Number(e.target.value) || 0))}
              placeholder="e.g. 5"
            />
          </Field>

          {/* 7 — Location */}
          <Field label="Location" hint="state" required error={touched.location && !profile.location ? 'Select your state.' : undefined}>
            <Select
              className={`${err('location', !!profile.location)} ${ok('location', !!profile.location)}`}
              value={profile.location}
              onChange={e => set('location', e.target.value)}
            >
              <option value="">Select state…</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
        </div>

        {/* cross-field notice */}
        {profile.requiredLoanL > 0 && profile.projectCostL > 0 && profile.requiredLoanL > profile.projectCostL && (
          <div className="px-5 pb-4">
            <Banner tone="warn" title="Loan amount exceeds project cost.">
              Scheme rules fund a share of the project cost — reduce the loan or increase the project cost.
            </Banner>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 px-5 py-4">
          <p className="flex items-center gap-1.5 text-[12px] text-ink-500">
            <Lock size={12} /> No Aadhaar, PAN, OTP or passwords — this form never collects credentials.
          </p>
          <div className="flex gap-2">
            <Btn variant="outline" onClick={() => store.resetAll()}>Reset</Btn>
            <Btn onClick={submit} disabled={!valid} className={valid ? '' : 'opacity-45'}>
              Check My Eligibility <ArrowRight size={15} />
            </Btn>
          </div>
        </div>
      </Card>

      {valid && (
        <p className="flex items-center gap-1.5 text-[12.5px] text-teal-600">
          <CheckCircle2 size={14} /> All set — your answers are saved in this browser and you can continue anytime.
        </p>
      )}
    </div>
  );
}
