import {
  REQ, REC, employmentEvidence, homeTies, visitorSponsor, marriageCert, childrenDocs, prevRefusal, policeCerts,
} from './common.js';

const GOV = 'https://www.gov.uk';

const passport = {
  id: 'passport', category: 'identity', level: REQ,
  title: 'Current passport',
  desc: 'With at least one blank page for your visa. Have any previous passports ready too.',
};
const application = {
  id: 'application', category: 'identity', level: REQ,
  title: 'Online application on GOV.UK',
  desc: 'Complete the form, pay the fee (and Immigration Health Surcharge if it applies), then prove your identity at a visa application centre or with the UK Immigration: ID Check app.',
};
const biometrics = {
  id: 'biometrics', category: 'identity', level: REQ,
  title: 'Biometrics appointment confirmation',
  desc: 'Fingerprints and a photo are taken at the visa application centre.',
};
const refusal = prevRefusal('Declare every previous refusal from any country. Include the refusal letter and explain what has changed.');
const tb = {
  id: 'tb', category: 'health', level: REQ, when: (c) => c.nationality?.ukTB,
  title: 'Tuberculosis (TB) test certificate',
  desc: 'Required if you are coming for more than 6 months and live in a listed country. Must come from a UK Home Office approved clinic.',
};
const funds28 = (desc) => ({
  id: 'funds', category: 'finance', level: REQ, translatable: true,
  title: 'Proof of maintenance funds (28-day rule)',
  desc,
});

export default {
  id: 'uk',
  name: 'United Kingdom',
  flag: 'gb',
  authority: 'UK Visas and Immigration (UKVI)',
  translationRule:
    'UKVI requires a full translation of every document not in English or Welsh. Each translation must be independently verifiable and include the translator’s confirmation that it is accurate, the date, the translator’s full name and signature, and their contact details.',
  visaTypes: [
    {
      id: 'visitor',
      name: 'Standard Visitor visa',
      code: 'Up to 6 months',
      blurb: 'Tourism, visiting family or friends, or business meetings.',
      profile: ['employment', 'sponsored', 'married', 'children', 'prevRefusal', 'nonEnglish'],
      visitor: true,
      links: [{ label: 'Standard Visitor visa', url: `${GOV}/standard-visitor` }],
      notes: [
        'Applications are often refused for unexplained deposits, funds that don’t match your income, or weak reasons to return home.',
      ],
      items: [
        passport,
        application,
        biometrics,
        {
          id: 'old-passports', category: 'identity', level: REC,
          title: 'Previous passports and travel history',
          desc: 'Past visas for the UK, US, Schengen, Canada or Australia help show you comply with visa rules.',
        },
        refusal,
        {
          id: 'bank', category: 'finance', level: REQ, translatable: true,
          title: 'Personal bank statements (last 6 months)',
          desc: 'Show enough money for the trip, and that the money is genuinely yours. Explain any large recent deposits.',
        },
        {
          id: 'deposit-source', category: 'finance', level: REC, translatable: true,
          title: 'Proof of source for any large deposit',
          desc: 'For example a sale agreement, gift letter or bonus letter.',
        },
        ...employmentEvidence(),
        ...homeTies(),
        ...visitorSponsor('States who they are, their relationship to you, their UK address, how long you will stay and whether they will support you financially.'),
        {
          id: 'itinerary', category: 'travel', level: REC,
          title: 'Travel itinerary',
          desc: 'Dates, places you will visit and the purpose of each part of the trip.',
        },
        {
          id: 'accommodation', category: 'travel', level: REC,
          title: 'Accommodation details',
          desc: 'Hotel reservations or your host’s address and proof they live there.',
        },
        {
          id: 'flights', category: 'travel', level: REC,
          title: 'Return flight reservation',
          desc: 'Don’t buy non-refundable tickets until your visa is approved.',
        },
        {
          id: 'business-invite', category: 'purpose', level: REC,
          title: 'Business invitation letter (business visits only)',
          desc: 'From the UK company: purpose, dates and who pays costs.',
        },
        {
          id: 'cover', category: 'purpose', level: REC,
          title: 'Cover letter',
          desc: 'Who you are, why you are visiting, who pays and why you will return home.',
        },
        marriageCert(),
        ...childrenDocs('A signed letter of consent from both parents or legal guardians, with a copy of their passport or ID.'),
      ],
    },
    {
      id: 'student',
      name: 'Student visa',
      code: 'Courses over 6 months',
      blurb: 'Study at a licensed UK student sponsor.',
      profile: ['sponsored', 'married', 'children', 'prevRefusal', 'nonEnglish'],
      links: [{ label: 'Student visa', url: `${GOV}/student-visa` }],
      notes: [
        'Your funds must be held for 28 consecutive days, and the end of that period must be no more than 31 days before you apply.',
        'Some nationalities qualify for “differential evidence” and may not need to submit financial documents up front. Keep them ready anyway.',
      ],
      items: [
        passport,
        application,
        biometrics,
        refusal,
        {
          id: 'cas', category: 'education', level: REQ,
          title: 'Confirmation of Acceptance for Studies (CAS)',
          desc: 'Reference number from your university or college. You can apply up to 6 months before your course starts.',
        },
        {
          id: 'qualifications', category: 'education', level: REQ, translatable: true,
          title: 'Qualifications listed on your CAS',
          desc: 'Original certificates and transcripts the university used to make your offer.',
        },
        {
          id: 'english', category: 'education', level: REC,
          title: 'English language evidence',
          desc: 'A Secure English Language Test (SELT) or other evidence, unless your university has assessed it.',
        },
        {
          id: 'atas', category: 'education', level: REC,
          title: 'ATAS certificate (certain science and technology subjects)',
          desc: 'Needed if your CAS says your course requires an Academic Technology Approval Scheme certificate.',
        },
        funds28('Enough to pay any unpaid course fees plus living costs for up to 9 months. Bank statements or a letter from your bank.'),
        {
          id: 'sponsor-consent', category: 'finance', level: REQ, translatable: true, when: (c) => c.sponsored,
          title: 'Financial sponsor letter or parental consent for funds',
          desc: 'An official sponsor’s letter, or if parents’ money is used, their consent and your birth certificate to prove the relationship.',
        },
        tb,
        marriageCert(REQ),
        {
          id: 'child-birth', category: 'family', level: REQ, translatable: true, when: (c) => c.children,
          title: 'Birth certificates for dependant children',
          desc: 'Dependants are only allowed in limited cases, for example postgraduate research courses.',
        },
      ],
    },
    {
      id: 'skilled-worker',
      name: 'Skilled Worker visa',
      code: 'Sponsored employment',
      blurb: 'A job offer from a UK employer with a sponsor licence.',
      profile: ['married', 'children', 'prevRefusal', 'nonEnglish'],
      links: [{ label: 'Skilled Worker visa', url: `${GOV}/skilled-worker-visa` }],
      notes: ['Check your job meets the current salary and skill thresholds. These change regularly.'],
      items: [
        passport,
        application,
        biometrics,
        refusal,
        {
          id: 'cos', category: 'work', level: REQ,
          title: 'Certificate of Sponsorship (CoS) reference number',
          desc: 'Issued by your employer. You must apply within 3 months of receiving it.',
        },
        {
          id: 'job', category: 'work', level: REQ,
          title: 'Job title, occupation code and annual salary',
          desc: 'These must match what your employer entered on the CoS.',
        },
        {
          id: 'english', category: 'work', level: REQ, translatable: true,
          title: 'English language evidence',
          desc: 'A SELT pass, a degree taught in English, or nationality of a majority English-speaking country.',
        },
        funds28('Personal savings held for 28 consecutive days, unless your employer certifies maintenance on your CoS.'),
        {
          id: 'criminal', category: 'health', level: REC, translatable: true,
          title: 'Criminal record certificate (health, education or social-care jobs)',
          desc: 'From every country you have lived in for 12 months or more in the last 10 years.',
        },
        {
          id: 'phd', category: 'education', level: REC, translatable: true,
          title: 'PhD or qualification certificates (if claiming points)',
          desc: 'Ecctis confirmation may be needed for overseas qualifications.',
        },
        tb,
        marriageCert(REQ),
        {
          id: 'child-birth', category: 'family', level: REQ, translatable: true, when: (c) => c.children,
          title: 'Birth certificates for dependant children',
          desc: 'For each child applying as your dependant.',
        },
      ],
    },
    {
      id: 'family-partner',
      name: 'Family visa – Spouse / Partner',
      code: 'Partner of a British or settled person',
      blurb: 'Join your spouse, civil partner or long-term partner in the UK.',
      profile: ['married', 'children', 'prevRefusal', 'nonEnglish'],
      toggleLabels: { married: 'We are married or in a civil partnership (leave off if unmarried partners)' },
      links: [{ label: 'Family visa – partner or spouse', url: `${GOV}/uk-family-visa/partner-spouse` }],
      notes: [
        'You must meet the minimum income (financial) requirement. Check the current threshold on GOV.UK before applying.',
        'The specified evidence rules for income are strict. Missing a single payslip can lead to refusal.',
      ],
      items: [
        passport,
        application,
        biometrics,
        refusal,
        {
          id: 'rel-married', category: 'relationship', level: REQ, translatable: true, when: (c) => c.married,
          title: 'Marriage or civil partnership certificate',
          desc: 'Must be legally recognised in the UK.',
        },
        {
          id: 'rel-unmarried', category: 'relationship', level: REQ, translatable: true, when: (c) => !c.married,
          title: 'Evidence of living together for 2 years',
          desc: 'Joint tenancy, bills or bank statements at the same address covering at least 2 years.',
        },
        {
          id: 'rel-genuine', category: 'relationship', level: REQ,
          title: 'Evidence your relationship is genuine',
          desc: 'Photos over time, messages and call logs, visits, travel together and plans to live together in the UK.',
        },
        {
          id: 'prev-marriage', category: 'relationship', level: REC, translatable: true,
          title: 'Divorce or death certificates from previous marriages (if any)',
          desc: 'For either partner.',
        },
        {
          id: 'sp-status', category: 'sponsor', level: REQ,
          title: 'Partner’s proof of British citizenship or settled status',
          desc: 'British passport, or evidence of ILR, settled status or refugee status.',
        },
        {
          id: 'fin-income', category: 'finance', level: REQ, translatable: true,
          title: 'Specified evidence of income',
          desc: 'Usually 6 months of payslips, matching bank statements and an employer letter confirming salary, role and length of employment.',
        },
        {
          id: 'fin-savings', category: 'finance', level: REC, translatable: true,
          title: 'Cash savings evidence (if relying on savings)',
          desc: 'Statements showing the savings were held for at least 6 months.',
        },
        {
          id: 'accommodation', category: 'sponsor', level: REQ,
          title: 'Proof of adequate accommodation in the UK',
          desc: 'Tenancy agreement or mortgage statement, plus landlord permission or a property inspection report if needed.',
        },
        {
          id: 'english', category: 'identity', level: REQ,
          title: 'English language evidence (A1 or above)',
          desc: 'An approved SELT, a degree taught in English, or an exemption.',
        },
        tb,
        {
          id: 'child-birth', category: 'family', level: REQ, translatable: true, when: (c) => c.children,
          title: 'Birth certificates for children applying with you',
          desc: 'Plus evidence of sole responsibility or the other parent’s consent where relevant.',
        },
        policeCerts('Only if requested, or if you have a criminal record in any country.', REC),
      ],
    },
  ],

  nationalityNotes(nat, visa) {
    if (!nat) return [];
    if (nat.code === 'GB') return [{ type: 'stop', text: 'British citizens don’t need a visa to enter the UK.' }];
    const notes = [];
    if (visa?.visitor && nat.uk === 'NONE')
      notes.push({ type: 'info', text: 'Irish citizens can travel to the UK freely under the Common Travel Area and don’t need a visa or ETA.' });
    if (visa?.visitor && nat.uk === 'ETA')
      notes.push({ type: 'info', text: `As a ${nat.name} passport holder you usually don’t need a visa for visits of up to 6 months, but you need an Electronic Travel Authorisation (ETA) before you travel.`, link: `${GOV}/eta` });
    if (!visa?.visitor && nat.ukTB)
      notes.push({ type: 'warn', text: `If you live in ${nat.name}, you need a TB test certificate from an approved clinic for stays over 6 months. We’ve added it to your checklist.`, link: `${GOV}/tb-test-visa` });
    return notes;
  },
};
