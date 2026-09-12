import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

/* ------------------------------------------------------------------- logo */
export function Logo({ size = 30, word = true }: { size?: number; word?: boolean }) {
  return (
    <span className="inline-flex select-none items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#123c63" />
        <path d="M12 40 L32 14 L52 40" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 50 h20" stroke="#e9b949" strokeWidth="6" strokeLinecap="round" />
      </svg>
      {word && (
        <span className="text-[17px] font-bold tracking-tight text-ink-900">
          Venture<span className="text-saffron-500">Setu</span>
        </span>
      )}
    </span>
  );
}

/* ---------------------------------------------------------------- buttons */
type BtnVariant = 'primary' | 'accent' | 'outline' | 'outlineLight';
export function Btn({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'sm' | 'md' | 'lg' }) {
  const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-medium transition disabled:pointer-events-none disabled:opacity-45';
  const sizes = { sm: 'px-3 py-1.5 text-[12.5px]', md: 'px-4 py-2.5 text-[13.5px]', lg: 'px-6 py-3 text-[15px]' };
  const variants: Record<BtnVariant, string> = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    outlineLight: 'btn-outline-light',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ cards */
export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardHead({ title, sub, right }: { title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink-200 px-5 py-4">
      <div>
        <h3 className="text-[14.5px] font-semibold tracking-tight text-ink-900">{title}</h3>
        {sub && <p className="mt-0.5 text-[12px] leading-snug text-ink-500">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Chip({ children, tone = 'neutral', className = '' }: { children: ReactNode; tone?: 'neutral' | 'saffron' | 'teal' | 'green' | 'rose'; className?: string }) {
  const tones = {
    neutral: '',
    saffron: 'chip-saffron',
    teal: 'chip-teal',
    green: 'chip-green',
    rose: 'chip-rose',
  };
  return <span className={`chip ${tones[tone]} ${className}`}>{children}</span>;
}

/* ----------------------------------------------------------------- fields */
export function Field({ label, hint, error, children, required }: { label: ReactNode; hint?: ReactNode; error?: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2 text-[12.5px] font-medium text-ink-700">
        <span>
          {label}
          {required && <span className="ml-0.5 text-saffron-600">*</span>}
        </span>
        {hint && <span className="text-[11px] font-normal text-ink-400">{hint}</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1 block text-[11.5px] font-medium text-[#b23a48]">{error}</span>
      )}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-[10px] border border-ink-300 bg-white px-3.5 py-2.5 text-[14px] text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-ink-900 focus:shadow-[0_0_0_3px_rgba(18,60,99,0.12)] ${props.className ?? ''}`}
    />
  );
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full appearance-none rounded-[10px] border border-ink-300 bg-white px-3.5 py-2.5 text-[14px] text-ink-800 outline-none transition focus:border-ink-900 focus:shadow-[0_0_0_3px_rgba(18,60,99,0.12)] ${props.className ?? ''}`}
    >
      {children}
    </select>
  );
}

/* ------------------------------------------------------------- stat block */
export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: string; tone?: 'saffron' | 'teal' }) {
  const ring =
    tone === 'saffron' ? 'border-t-saffron-400' : tone === 'teal' ? 'border-t-teal-400' : 'border-t-ink-900';
  return (
    <div className={`card border-t-[3px] ${ring} px-5 py-4`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400">{label}</div>
      <div className="tnum mt-1 text-[22px] font-bold leading-tight text-ink-900">{value}</div>
      {sub && <div className="mt-0.5 text-[11.5px] text-ink-500">{sub}</div>}
    </div>
  );
}/* ----------------------------------------------------------------- banner */
export function Banner({ tone = 'info', title, children }: { tone?: 'info' | 'warn' | 'ok'; title: string; children?: ReactNode }) {
  const styles = {
    info: 'border-ink-300 bg-ink-50 text-ink-700',
    warn: 'border-saffron-300 bg-saffron-50 text-[#6b4e0a]',
    ok: 'border-[#c4e5d2] bg-[#e8f6ee] text-[#1c5c38]',
  };
  const icons = {
    info: <Info size={17} className="mt-0.5 shrink-0 text-ink-500" />,
    warn: <AlertTriangle size={17} className="mt-0.5 shrink-0 text-saffron-600" />,
    ok: <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#2f9e63]" />,
  };
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-[13px] leading-relaxed ${styles[tone]}`}>
      {icons[tone]}
      <div>
        <span className="font-semibold">{title}</span>
        {children && <span className="block text-[12.5px] opacity-90">{children}</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ modal */
export function Modal({ open, onClose, title, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-t-2xl bg-white shadow-pop sm:rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-ink-200 bg-white/95 px-5 py-4 backdrop-blur">
          <h3 className="text-[15px] font-bold tracking-tight text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink-200 text-ink-500 transition hover:bg-ink-50 hover:text-ink-900"
          >
            <X size={15} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
