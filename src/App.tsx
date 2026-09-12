import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ProfileProvider } from './lib/profileStore';
import { AppShell } from './components/layout';
import { Btn } from './components/ui';
import Dashboard from './pages/Dashboard';
import ApplicantProfile from './pages/ApplicantProfile';
import Eligibility from './pages/Eligibility';
import Repayment from './pages/Repayment';
import PartnerLocator from './pages/PartnerLocator';
import Recommendation from './pages/Recommendation';
import Sources from './pages/Sources';

function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <span className="text-[56px] font-bold text-ink-300">404</span>
      <p className="text-[14px] text-ink-500">That page doesn't exist — but your journey does.</p>
      <Link to="/"><Btn>Back to dashboard</Btn></Link>
    </div>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<ApplicantProfile />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/repayment" element={<Repayment />} />
            <Route path="/partners" element={<PartnerLocator />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/about" element={<Sources />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ProfileProvider>
  );
}
