import type { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import Navbar from './Navbar';
import ProgressStepper from './ProgressStepper';

/* ============================================================
   AppShell — header (Navbar), journey stepper, page content
   and footer. Every route renders inside this shell.
   ============================================================ */

function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-2 text-[12.5px] leading-snug text-ink-500">
            <ShieldAlert size={15} className="mt-0.5 shrink-0 text-saffron-600" />
            <span>
              <strong className="font-semibold text-ink-700">Not an approval or guarantee.</strong> VentureSetu
              only organises what to verify — final decisions rest with banks, agencies and government
              departments.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11.5px] text-ink-400">
            <span>SIH26092 · prototype</span>
            <span>·</span>
            <span>Data stays in your browser</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="border-b border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
          <ProgressStepper />
        </div>
      </div>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">{children}</main>
      <Footer />
    </div>
  );
}
