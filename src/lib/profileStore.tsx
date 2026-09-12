import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { EMPTY_PROFILE, type Profile, type StepId } from './types';

/* ============================================================
   Mock app state — the only stateful part of the prototype.
   Persisted to localStorage so a demo can be resumed. No
   backend; nothing sensitive is ever collected.
   ============================================================ */

export const JOURNEY_STEPS: { id: StepId | 'recommendation'; label: string; to: string }[] = [
  { id: 'profile', label: 'Profile', to: '/profile' },
  { id: 'eligibility', label: 'Eligibility', to: '/eligibility' },
  { id: 'repayment', label: 'Repayment', to: '/repayment' },
  { id: 'partner', label: 'Partner', to: '/partners' },
  { id: 'recommendation', label: 'Recommendation', to: '/recommendation' },
];

const KEY = 'venturesetu.profile.v2';

interface Persisted {
  profile: Profile;
  completed: Partial<Record<StepId, boolean>>;
  selectedSchemeId: string | null;
  selectedPartnerId: string | null;
}

const initial: Persisted = {
  profile: { ...EMPTY_PROFILE },
  completed: {},
  selectedSchemeId: null,
  selectedPartnerId: null,
};

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const p = JSON.parse(raw) as Partial<Persisted>;
    return {
      profile: { ...initial.profile, ...(p.profile ?? {}) },
      completed: p.completed ?? {},
      selectedSchemeId: p.selectedSchemeId ?? null,
      selectedPartnerId: p.selectedPartnerId ?? null,
    };
  } catch {
    return initial;
  }
}

interface Store extends Persisted {
  setProfile: (patch: Partial<Profile>) => void;
  markComplete: (step: StepId) => void;
  selectScheme: (id: string | null) => void;
  selectPartner: (id: string | null) => void;
  resetAll: () => void;
}

const Ctx = createContext<Store | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* session-only mode */
    }
  }, [state]);

  const store: Store = {
    ...state,
    setProfile: patch => setState(s => ({ ...s, profile: { ...s.profile, ...patch } })),
    markComplete: step => setState(s => ({ ...s, completed: { ...s.completed, [step]: true } })),
    selectScheme: id => setState(s => ({ ...s, selectedSchemeId: id })),
    selectPartner: id => setState(s => ({ ...s, selectedPartnerId: id })),
    resetAll: () => setState({ ...initial, profile: { ...EMPTY_PROFILE } }),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useProfileStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProfileStore must be used inside ProfileProvider');
  return v;
}
