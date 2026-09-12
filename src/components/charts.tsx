import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ============================================================
   Dependency-free SVG charts reused from the original codebase,
   converted from framer-motion to plain CSS transitions.
   ============================================================ */

function useMeasure(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(560);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(es => setW(es[0].contentRect.width));
    ro.observe(ref.current);
    setW(ref.current.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/* ----------------------------------------------------------------- Donut */
export function Donut({ segs, size = 150, center, centerSub }: { segs: { label: string; value: number; color: string }[]; size?: number; center?: ReactNode; centerSub?: string }) {
  const total = segs.reduce((a, s) => a + s.value, 0) || 1;
  const strokeW = 16;
  const r = (size - strokeW) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label="Breakdown chart">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5ebf3" strokeWidth={strokeW} fill="none" />
          {segs.map(s => {
            const frac = s.value / total;
            const dash = `${Math.max(0, frac * c - 2.5)} ${c}`;
            const offset = -acc * c;
            acc += frac;
            return (
              <circle key={s.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={strokeW} strokeLinecap="butt" strokeDasharray={dash} strokeDashoffset={offset} />
            );
          })}
        </svg>
        {center && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="tnum text-[17px] font-bold leading-none text-ink-900">{center}</span>
            {centerSub && <span className="mt-1 text-[9.5px] font-semibold uppercase tracking-wider text-ink-400">{centerSub}</span>}
          </div>
        )}
      </div>
      <ul className="space-y-2">
        {segs.map(s => (
          <li key={s.label} className="flex items-center gap-2.5 text-[12.5px]">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="text-ink-600">{s.label}</span>
            <span className="tnum ml-auto font-medium text-ink-900">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------- stacked repayment bars (₹) */
export function RepaymentBars({ rows, height = 200 }: { rows: { label: string; principal: number; interest: number; balance: number }[]; height?: number }) {
  const [ref, w] = useMeasure();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 52, r: 8, t: 14, b: 24 };
  const iw = Math.max(10, w - pad.l - pad.r);
  const ih = height - pad.t - pad.b;
  const max = Math.max(...rows.map(r => r.principal + r.interest), 1) * 1.1;
  const n = rows.length || 1;
  const slot = iw / n;
  const bw = Math.min(46, slot * 0.55);
  const fmtY = (v: number) => (v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${Math.round(v / 1000)}k`);
  return (
    <div ref={ref} className="relative w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} onMouseLeave={() => setHover(null)} role="img" aria-label="Yearly principal and interest">
        {[0.33, 0.66, 1].map(f => (
          <g key={f}>
            <line x1={pad.l} x2={w - pad.r} y1={pad.t + ih * f} y2={pad.t + ih * f} stroke="#e5ebf3" strokeDasharray="2 4" />
            <text x={pad.l - 6} y={pad.t + ih * f + 3} textAnchor="end" fontSize="9.5" fill="#8fa0b5" fontFamily="Inter, sans-serif">
              {fmtY(max * (1 - f))}
            </text>
          </g>
        ))}
        {rows.map((r, i) => {
          const cx = pad.l + slot * i + slot / 2;
          const hT = ((r.principal + r.interest) / max) * ih;
          const hI = (r.interest / max) * ih;
          const hP = hT - hI;
          return (
            <g key={r.label} onMouseEnter={() => setHover(i)} opacity={hover === null || hover === i ? 1 : 0.45} style={{ transition: 'opacity .15s' }}>
              <rect x={cx - bw / 2} y={pad.t + ih - hT} width={bw} height={hI} fill="#e9b949" rx="2" />
              <rect x={cx - bw / 2} y={pad.t + ih - hP} width={bw} height={hP} fill="#123c63" rx="2" />
              <text x={cx} y={height - 6} textAnchor="middle" fontSize="10" fill="#5f7189" fontFamily="Inter, sans-serif">
                {r.label}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="tnum pointer-events-none absolute z-20 -translate-x-1/2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-[11.5px] shadow-pop"
          style={{ left: `${((pad.l + slot * hover + slot / 2) / w) * 100}%`, top: 0 }}
        >
          <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">{rows[hover].label}</div>
          <div className="font-semibold text-ink-900">Principal ₹{rows[hover].principal.toLocaleString('en-IN')}</div>
          <div className="text-saffron-600">Interest ₹{rows[hover].interest.toLocaleString('en-IN')}</div>
          <div className="text-ink-500">Balance ₹{rows[hover].balance.toLocaleString('en-IN')}</div>
        </div>
      )}
    </div>
  );
}
