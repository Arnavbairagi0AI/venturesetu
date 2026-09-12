import type { Partner } from '../lib/types';

/* ============================================================
   Prototype partner data — LOCAL MOCK ONLY.
   Distances are mock straight-line values from the applicant's
   district headquarters; the capacity indicator is a static
   prototype figure, not live funding availability.
   ============================================================ */

export const PARTNERS: Partner[] = [
  {
    id: 'sbi-cuttack',
    name: 'State Bank of India — District SME Branch',
    type: 'Public sector bank',
    authorizedSchemeIds: ['mudra-kishore', 'mudra-tarun', 'standup', 'pmegp'],
    location: 'Cuttack, Odisha',
    distanceKm: 6,
    contact: 'Landline via branch locator · sbi.co.in',
    authorization: 'authorized',
    capacityPct: 62,
  },
  {
    id: 'pnb-main',
    name: 'Punjab National Bank — Main Branch',
    type: 'Public sector bank',
    authorizedSchemeIds: ['mudra-kishore', 'mudra-tarun', 'pmegp'],
    location: 'Bhubaneswar, Odisha',
    distanceKm: 24,
    contact: 'pnbindia.in branch directory',
    authorization: 'authorized',
    capacityPct: 48,
  },
  {
    id: 'bob-rural',
    name: 'Bank of Baroda — Rural Finance Desk',
    type: 'Public sector bank',
    authorizedSchemeIds: ['mudra-kishore', 'standup'],
    location: 'Jajpur Road, Odisha',
    distanceKm: 38,
    contact: 'bankofbaroda.in branch locator',
    authorization: 'authorized',
    capacityPct: 75,
  },
  {
    id: 'icici-msme',
    name: 'ICICI Bank — MSME Desk',
    type: 'Private bank',
    authorizedSchemeIds: ['mudra-tarun', 'standup'],
    location: 'Bhubaneswar, Odisha',
    distanceKm: 26,
    contact: 'icicibank.com MSME helpline',
    authorization: 'empanelled',
    capacityPct: 55,
  },
  {
    id: 'shriram-nbfc',
    name: 'Shriram Finance — Micro Enterprise Loans',
    type: 'NBFC',
    authorizedSchemeIds: ['mudra-kishore'],
    location: 'Dhenkanal, Odisha',
    distanceKm: 52,
    contact: 'shriram.com micro-loan desk',
    authorization: 'empanelled',
    capacityPct: 81,
  },
  {
    id: 'rseti-odisha',
    name: 'RSETI Cuttack — Skill & EDP Centre',
    type: 'Training institute (RSETI)',
    authorizedSchemeIds: ['skill-edp', 'pmegp'],
    location: 'Cuttack, Odisha',
    distanceKm: 7,
    contact: 'Via district lead bank office',
    authorization: 'authorized',
    capacityPct: 40,
  },
  {
    id: 'dic-odisha',
    name: 'District Industries Centre — Handholding Cell',
    type: 'Handholding agency',
    authorizedSchemeIds: ['pmegp', 'pmfme', 'skill-edp'],
    location: 'Cuttack Collectorate, Odisha',
    distanceKm: 5,
    contact: 'DIC help desk, working hours',
    authorization: 'authorized',
    capacityPct: 35,
  },
  {
    id: 'nedfi-ne',
    name: 'NEDFi — Regional Enterprise Window',
    type: 'Regional office',
    authorizedSchemeIds: ['pmegp', 'standup', 'pmfme'],
    location: 'Guwahati, Assam',
    distanceKm: 620,
    contact: 'nedfi.com regional offices',
    authorization: 'referral',
    capacityPct: 58,
  },
  {
    id: 'sidbi-desk',
    name: 'SIDBI — Cluster Finance Desk',
    type: 'Regional office',
    authorizedSchemeIds: ['standup', 'pmegp'],
    location: 'Bhubaneswar, Odisha',
    distanceKm: 25,
    contact: 'sidbi.in office directory',
    authorization: 'referral',
    capacityPct: 67,
  },
];

export function partnerById(id: string): Partner | undefined {
  return PARTNERS.find(p => p.id === id);
}
