/**
 * Shared building blocks for country files.
 *
 * Item shape:
 *  {
 *    id:           unique within a visa type (used to save progress)
 *    title:        short document name
 *    desc:         what exactly to provide / why it matters
 *    level:        'required' | 'recommended'
 *    category:     key from CATEGORIES
 *    translatable: true if this document is often issued in a language other than English
 *    when:         optional (ctx) => boolean – only show for matching profiles
 *  }
 *
 * ctx = { employment, sponsored, married, children, prevRefusal, nonEnglish, nationality }
 */

export const REQ = 'required';
export const REC = 'recommended';

export const CATEGORIES = {
  identity: { label: 'Identity & application', icon: 'id' },
  finance: { label: 'Financial evidence', icon: 'wallet' },
  employment: { label: 'Employment & ties to home', icon: 'briefcase' },
  purpose: { label: 'Purpose of your stay', icon: 'target' },
  education: { label: 'Study & qualifications', icon: 'cap' },
  work: { label: 'Work & skills', icon: 'briefcase' },
  relationship: { label: 'Relationship evidence', icon: 'heart' },
  sponsor: { label: 'Sponsor documents', icon: 'users' },
  travel: { label: 'Travel plans', icon: 'plane' },
  family: { label: 'Family & children', icon: 'users' },
  health: { label: 'Health & character', icon: 'shield' },
};

/** Profile options the user can answer. Each visa type lists the ones it uses. */
export const EMPLOYMENT_OPTIONS = [
  { id: 'employed', label: 'Employed' },
  { id: 'self', label: 'Self-employed / business owner' },
  { id: 'student', label: 'Student' },
  { id: 'retired', label: 'Retired' },
  { id: 'unemployed', label: 'Not working / homemaker' },
];

export const PROFILE_TOGGLES = {
  sponsored: { label: 'Someone else is funding or hosting my trip', hint: 'A family member, friend or company is paying or inviting you.' },
  married: { label: 'I am married or in a de facto relationship', hint: 'Adds marriage / partner documents where relevant.' },
  children: { label: 'Children under 18 are included in my application', hint: 'Adds birth certificates and parental consent documents.' },
  prevRefusal: { label: 'I have been refused a visa before (any country)', hint: 'You must declare it, so prepare the paperwork.' },
  nonEnglish: { label: 'Some of my documents are not in English', hint: 'We will flag which documents need a certified translation.' },
};

const is = (status) => (ctx) => ctx.employment === status;

/** Employment / income evidence used by visitor-style visas. */
export const employmentEvidence = () => [
  {
    id: 'emp-letter', category: 'employment', level: REQ, translatable: true, when: is('employed'),
    title: 'Employment letter from your employer',
    desc: 'On company letterhead, signed and dated. Should state your position, salary, start date, approved leave dates and that you will return to work.',
  },
  {
    id: 'emp-payslips', category: 'employment', level: REC, translatable: true, when: is('employed'),
    title: 'Payslips for the last 3–6 months',
    desc: 'Salary amounts should match the credits shown in your bank statements.',
  },
  {
    id: 'emp-tax', category: 'employment', level: REC, translatable: true, when: (c) => c.employment === 'employed' || c.employment === 'self',
    title: 'Income tax returns or assessments (last 1–2 years)',
    desc: 'Confirms your income is genuine, consistent and declared.',
  },
  {
    id: 'self-reg', category: 'employment', level: REQ, translatable: true, when: is('self'),
    title: 'Business registration or trade licence',
    desc: 'Proves the business exists and that you own or direct it.',
  },
  {
    id: 'self-bank', category: 'employment', level: REC, translatable: true, when: is('self'),
    title: 'Business bank statements (last 6 months)',
    desc: 'Shows the business is actively trading.',
  },
  {
    id: 'stu-enrol', category: 'employment', level: REQ, translatable: true, when: is('student'),
    title: 'Letter from your school or university',
    desc: 'Confirms you are enrolled, your course dates, and that you are approved to travel during this period.',
  },
  {
    id: 'ret-pension', category: 'employment', level: REQ, translatable: true, when: is('retired'),
    title: 'Pension or retirement income statements',
    desc: 'Recent statements showing regular retirement income.',
  },
  {
    id: 'unemp-support', category: 'employment', level: REQ, translatable: true, when: is('unemployed'),
    title: 'Evidence of who supports you financially',
    desc: 'For example your spouse’s employment letter and bank statements, plus proof of your relationship to them.',
  },
];

/** Ties-to-home evidence shared by visitor visas. */
export const homeTies = () => [
  {
    id: 'ties-property', category: 'employment', level: REC, translatable: true,
    title: 'Property ownership or long-term lease (if any)',
    desc: 'Title deeds, a mortgage statement or a rental agreement in your name show you have a home to return to.',
  },
  {
    id: 'ties-family', category: 'employment', level: REC, translatable: true,
    title: 'Evidence of close family at home (if any)',
    desc: 'For example a household or family registration record showing dependants who remain in your home country.',
  },
];

/** Sponsor / host documents for visitor visas. */
export const visitorSponsor = (hostDesc) => [
  {
    id: 'sp-invite', category: 'sponsor', level: REQ, when: (c) => c.sponsored,
    title: 'Invitation letter from your host or sponsor',
    desc: hostDesc,
  },
  {
    id: 'sp-status', category: 'sponsor', level: REQ, when: (c) => c.sponsored,
    title: 'Sponsor’s ID and immigration status',
    desc: 'Copy of their passport and proof of citizenship, permanent residence or valid visa.',
  },
  {
    id: 'sp-funds', category: 'sponsor', level: REQ, translatable: true, when: (c) => c.sponsored,
    title: 'Sponsor’s financial evidence',
    desc: 'Their recent bank statements and proof of income, if they are paying for your trip.',
  },
  {
    id: 'sp-relation', category: 'sponsor', level: REC, translatable: true, when: (c) => c.sponsored,
    title: 'Proof of your relationship to the sponsor',
    desc: 'For example birth certificates linking you to a family member, or photos and messages for friends.',
  },
];

export const marriageCert = (level = REC) => ({
  id: 'marriage-cert', category: 'family', level, translatable: true, when: (c) => c.married,
  title: 'Marriage certificate or evidence of de facto relationship',
  desc: 'Needed if your partner is included in the application or is supporting you.',
});

export const childrenDocs = (consentDesc) => [
  {
    id: 'child-birth', category: 'family', level: REQ, translatable: true, when: (c) => c.children,
    title: 'Birth certificates for each child',
    desc: 'Full birth certificates showing both parents’ names.',
  },
  {
    id: 'child-consent', category: 'family', level: REQ, translatable: true, when: (c) => c.children,
    title: 'Consent from any parent not travelling',
    desc: consentDesc,
  },
];

export const prevRefusal = (desc) => ({
  id: 'prev-refusal', category: 'identity', level: REQ, translatable: true, when: (c) => c.prevRefusal,
  title: 'Previous visa refusal letter(s)',
  desc,
});

export const policeCerts = (desc, level = REQ) => ({
  id: 'police', category: 'health', level, translatable: true,
  title: 'Police certificates',
  desc,
});
