import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Calculator, MapPin, BookOpenCheck, UserRound,
  FileCheck2, Menu, X,
} from 'lucide-react';
import { Logo, Chip } from './ui';

/* ============================================================
   Navbar — top navigation bar with desktop links and a mobile
   drawer. The seven destinations mirror the SIH26092 journey.
   ============================================================ */

const NAV = [
  { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', end: false, icon: UserRound },
  { to: '/eligibility', label: 'Eligibility', end: false, icon: ClipboardList },
  { to: '/repayment', label: 'Repayment', end: false, icon: Calculator },
  { to: '/partners', label: 'Partners', end: false, icon: MapPin },
  { to: '/recommendation', label: 'Recommendation', end: false, icon: FileCheck2 },
  { to: '/about', label: 'About / Sources', end: false, icon: BookOpenCheck },
];

function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" aria-label="VentureSetu home" className="shrink-0">
          <Logo />
        </Link>
        <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium transition ${
                  isActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 xl:flex">
          <Chip tone="teal">Decision-support prototype</Chip>
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-ink-200 text-ink-700 lg:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu size={17} />
        </button>
      </div>
    </header>
  );
}

function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-pop">
        <div className="flex items-center justify-between border-b border-ink-200 px-4 py-4">
          <Logo />
          <button onClick={onClose} aria-label="Close menu" className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Mobile">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] font-medium ${
                  isActive ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-100'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [drawer, setDrawer] = useState(false);
  return (
    <>
      <Header onMenu={() => setDrawer(true)} />
      <Drawer open={drawer} onClose={() => setDrawer(false)} />
    </>
  );
}
