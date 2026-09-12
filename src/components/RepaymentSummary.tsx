import { Card, CardHead, Stat } from './ui';
import { Donut } from './charts';
import { inr, type RepaymentSummary as Summary } from '../utils/repayment';

/* ============================================================
   Estimated repayment block — headline numbers + principal vs
   interest split. Labelled as demonstration output.
   ============================================================ */

export default function RepaymentSummary({ summary }: { summary: Summary }) {
  const principal = summary.loanInr;
  const interest = summary.totalInterest;
  return (
    <Card>
      <CardHead
        title="Estimated Repayment"
        sub="For demonstration purposes only — actual offers differ by lender"
      />
      <div className="grid gap-5 px-5 py-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Monthly EMI" value={inr(summary.emi)} sub={summary.moratoriumMonths > 0 ? `after ${summary.moratoriumMonths}-mo moratorium` : 'from month 1'} tone="saffron" />
          <Stat label="Total Interest" value={inr(interest)} sub="over full tenure" />
          <Stat label="Total Repayment" value={inr(summary.totalRepayment)} sub="principal + interest" />
          <Stat
            label="Tenure"
            value={`${summary.tenureMonths} mo`}
            sub={
              summary.moratoriumMonths > 0
                ? `${(summary.tenureMonths / 12).toFixed(1)} years · ${summary.moratoriumMonths}-mo moratorium`
                : `${(summary.tenureMonths / 12).toFixed(1)} years · no moratorium`
            }
            tone="teal"
          />
        </div>
        <div className="lg:pl-2">
          <Donut
            size={148}
            segs={[
              { label: 'Principal', value: principal, color: '#123c63' },
              { label: 'Interest', value: interest, color: '#e9b949' },
            ]}
            center={inr(principal + interest)}
            centerSub="total outflow"
          />
        </div>
      </div>
    </Card>
  );
}
