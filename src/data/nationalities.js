/**
 * Passport / nationality data.
 *
 * english:  'yes'     – civil documents are normally issued in English
 *           'partial' – some documents are in English, others in a local language
 *           'no'      – documents are normally not in English
 * au:  'eVisitor' | 'ETA' | 'SCV' | null   (Australia visitor alternatives)
 * uk:  'ETA' | 'NONE' | null                (UK visitor alternatives)
 * us:  'ESTA' | 'NONE' | null               (US visitor alternatives)
 * ukTB: applicants resident in this country are on the UK TB testing list
 *       (only applies to UK stays longer than 6 months).
 *
 * Entry rules change – review this file whenever governments update their lists.
 */
export const NATIONALITIES = [
  { code: 'AF', name: 'Afghanistan', english: 'no', ukTB: true },
  { code: 'AU', name: 'Australia', english: 'yes', uk: 'ETA', us: 'ESTA' },
  { code: 'BD', name: 'Bangladesh', english: 'partial', ukTB: true },
  { code: 'BR', name: 'Brazil', english: 'no', uk: 'ETA' },
  { code: 'CA', name: 'Canada', english: 'yes', au: 'ETA', uk: 'ETA', us: 'NONE' },
  { code: 'CN', name: 'China', english: 'no', ukTB: true },
  { code: 'CO', name: 'Colombia', english: 'no' },
  { code: 'FR', name: 'France', english: 'no', au: 'eVisitor', uk: 'ETA', us: 'ESTA' },
  { code: 'DE', name: 'Germany', english: 'no', au: 'eVisitor', uk: 'ETA', us: 'ESTA' },
  { code: 'GH', name: 'Ghana', english: 'partial', ukTB: true },
  { code: 'HK', name: 'Hong Kong (SAR)', english: 'partial', au: 'ETA', uk: 'ETA' },
  { code: 'IN', name: 'India', english: 'partial', ukTB: true },
  { code: 'ID', name: 'Indonesia', english: 'no', ukTB: true },
  { code: 'IR', name: 'Iran', english: 'no' },
  { code: 'IQ', name: 'Iraq', english: 'no' },
  { code: 'IE', name: 'Ireland', english: 'yes', au: 'eVisitor', uk: 'NONE', us: 'ESTA' },
  { code: 'IT', name: 'Italy', english: 'no', au: 'eVisitor', uk: 'ETA', us: 'ESTA' },
  { code: 'JP', name: 'Japan', english: 'no', au: 'ETA', uk: 'ETA', us: 'ESTA' },
  { code: 'KE', name: 'Kenya', english: 'partial', ukTB: true },
  { code: 'LB', name: 'Lebanon', english: 'no' },
  { code: 'MY', name: 'Malaysia', english: 'partial', au: 'ETA', uk: 'ETA', ukTB: true },
  { code: 'NP', name: 'Nepal', english: 'no', ukTB: true },
  { code: 'NL', name: 'Netherlands', english: 'no', au: 'eVisitor', uk: 'ETA', us: 'ESTA' },
  { code: 'NZ', name: 'New Zealand', english: 'yes', au: 'SCV', uk: 'ETA', us: 'ESTA' },
  { code: 'NG', name: 'Nigeria', english: 'partial', ukTB: true },
  { code: 'PK', name: 'Pakistan', english: 'partial', ukTB: true },
  { code: 'PH', name: 'Philippines', english: 'partial', ukTB: true },
  { code: 'SA', name: 'Saudi Arabia', english: 'no', uk: 'ETA' },
  { code: 'SG', name: 'Singapore', english: 'yes', au: 'ETA', uk: 'ETA', us: 'ESTA' },
  { code: 'ZA', name: 'South Africa', english: 'partial', ukTB: true },
  { code: 'KR', name: 'South Korea', english: 'no', au: 'ETA', uk: 'ETA', us: 'ESTA' },
  { code: 'ES', name: 'Spain', english: 'no', au: 'eVisitor', uk: 'ETA', us: 'ESTA' },
  { code: 'LK', name: 'Sri Lanka', english: 'partial', ukTB: true },
  { code: 'TH', name: 'Thailand', english: 'no', ukTB: true },
  { code: 'TR', name: 'Türkiye', english: 'no' },
  { code: 'AE', name: 'United Arab Emirates', english: 'no', uk: 'ETA' },
  { code: 'GB', name: 'United Kingdom', english: 'yes', au: 'eVisitor', us: 'ESTA' },
  { code: 'US', name: 'United States', english: 'yes', au: 'ETA', uk: 'ETA' },
  { code: 'VN', name: 'Vietnam', english: 'no', ukTB: true },
  { code: 'XX', name: 'Other country', english: 'no' },
];

export const flagEmoji = (code) =>
  code === 'XX'
    ? '🌐'
    : String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

export const getNationality = (code) => NATIONALITIES.find((n) => n.code === code) || null;
