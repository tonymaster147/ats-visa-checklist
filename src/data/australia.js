import {
  REQ, REC, employmentEvidence, homeTies, visitorSponsor, marriageCert, childrenDocs, prevRefusal, policeCerts,
} from './common.js';

const HA = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing';

const passport = (desc = 'Valid for your whole stay. Upload clear colour copies of the bio-data page and any pages with visas or stamps.') => ({
  id: 'passport', category: 'identity', level: REQ, title: 'Valid passport', desc,
});
const immi = {
  id: 'immiaccount', category: 'identity', level: REQ,
  title: 'Online application in ImmiAccount',
  desc: 'Australian visas are lodged online. Create an ImmiAccount, complete the form and attach scanned copies of every document.',
};
const photo = {
  id: 'photo', category: 'identity', level: REQ,
  title: 'Recent passport-style photograph',
  desc: '45 mm × 35 mm, plain light background, taken in the last 6 months.',
};
const nationalId = {
  id: 'national-id', category: 'identity', level: REC, translatable: true,
  title: 'National identity card (if your country issues one)',
  desc: 'Front and back copies.',
};
const birthCert = (level = REQ) => ({
  id: 'birth-cert', category: 'identity', level, translatable: true,
  title: 'Birth certificate',
  desc: 'Full birth certificate showing your parents’ names.',
});
const nameChange = {
  id: 'name-change', category: 'identity', level: REC, translatable: true,
  title: 'Evidence of any change of name',
  desc: 'Marriage certificate, deed poll or other official record if your name differs across documents.',
};
const health = (level = REC, desc = 'Only if Home Affairs asks. You will receive a HAP ID and must attend a panel clinic.') => ({
  id: 'health', category: 'health', level, title: 'Health examinations', desc,
});
const refusalDesc = 'You must declare previous refusals or cancellations. Include the refusal letter and a short explanation of what has changed since.';

const visitorBase = [
  passport(),
  immi,
  photo,
  nationalId,
  prevRefusal(refusalDesc),
  {
    id: 'bank', category: 'finance', level: REQ, translatable: true,
    title: 'Personal bank statements (last 3–6 months)',
    desc: 'Shows you can pay for your trip. Avoid large unexplained deposits shortly before applying.',
  },
  {
    id: 'savings', category: 'finance', level: REC, translatable: true,
    title: 'Other savings or assets',
    desc: 'Term deposits, investments or property valuations strengthen your financial position.',
  },
  ...employmentEvidence(),
  ...homeTies(),
  ...visitorSponsor('Explains who you are visiting, your relationship, where you will stay and who pays. Your host’s address and contact details should be included.'),
  {
    id: 'itinerary', category: 'travel', level: REC,
    title: 'Travel itinerary',
    desc: 'Planned dates, cities and activities. Shows your visit is genuine and temporary.',
  },
  {
    id: 'flights', category: 'travel', level: REC,
    title: 'Return flight reservation',
    desc: 'A reservation is enough. You don’t need to buy tickets before the visa is granted.',
  },
  {
    id: 'accommodation', category: 'travel', level: REC,
    title: 'Accommodation details',
    desc: 'Hotel bookings or your host’s address.',
  },
  {
    id: 'insurance', category: 'travel', level: REC,
    title: 'Travel health insurance',
    desc: 'Not always mandatory but strongly recommended. Australian medical costs are high for visitors.',
  },
  marriageCert(),
  ...childrenDocs('Form 1229 (Consent to grant an Australian visa to a child under 18) signed by each non-travelling parent, with a certified copy of their ID.'),
  health(),
];

export default {
  id: 'au',
  name: 'Australia',
  flag: 'au',
  authority: 'Department of Home Affairs',
  translationRule:
    'Home Affairs requires an English translation of every document not in English. Translations made in Australia must be done by a NAATI-certified translator. Translations made outside Australia must include the translator’s full name, address, phone number and qualifications.',
  visaTypes: [
    {
      id: 'visitor-600',
      name: 'Visitor visa – Tourist',
      code: 'Subclass 600',
      blurb: 'Holidays, sightseeing or visiting family and friends.',
      profile: ['employment', 'sponsored', 'married', 'children', 'prevRefusal', 'nonEnglish'],
      visitor: true,
      links: [{ label: 'Visitor visa (subclass 600)', url: `${HA}/visitor-600` }],
      notes: [
        'Show you are a genuine visitor who will leave Australia. Strong ties to home (job, family, property) matter most.',
      ],
      items: [
        ...visitorBase,
        {
          id: 'cover', category: 'purpose', level: REC,
          title: 'Cover letter / personal statement',
          desc: 'Who you are, why you are visiting, how long, who pays and why you will return home.',
        },
      ],
    },
    {
      id: 'visitor-600-business',
      name: 'Visitor visa – Business',
      code: 'Subclass 600',
      blurb: 'Meetings, conferences or negotiations (no paid work).',
      profile: ['employment', 'married', 'children', 'prevRefusal', 'nonEnglish'],
      visitor: true,
      links: [{ label: 'Visitor visa (subclass 600)', url: `${HA}/visitor-600` }],
      notes: ['The Business Visitor stream does not allow you to work or sell goods and services to the public.'],
      items: [
        ...visitorBase,
        {
          id: 'biz-invite', category: 'purpose', level: REQ,
          title: 'Invitation from the Australian business or event organiser',
          desc: 'Purpose, dates, the people you will meet and who is paying for the trip.',
        },
        {
          id: 'biz-employer', category: 'purpose', level: REQ, translatable: true,
          title: 'Letter from your employer explaining the trip',
          desc: 'Confirms your role, the business purpose and that the company supports your travel.',
        },
        {
          id: 'biz-conf', category: 'purpose', level: REC,
          title: 'Conference or trade-fair registration (if attending)',
          desc: 'Registration confirmation and the event programme.',
        },
      ],
    },
    {
      id: 'student-500',
      name: 'Student visa',
      code: 'Subclass 500',
      blurb: 'Full-time study at a registered Australian institution.',
      profile: ['sponsored', 'married', 'children', 'prevRefusal', 'nonEnglish'],
      links: [{ label: 'Student visa (subclass 500)', url: `${HA}/student-500` }],
      notes: [
        'Your answers to the Genuine Student questions must explain why you chose this course, provider and Australia.',
        'Applicants under 18 need approved welfare arrangements, either a CAAW from the education provider or a nominated relative.',
      ],
      items: [
        passport(),
        immi,
        photo,
        birthCert(REC),
        prevRefusal(refusalDesc),
        {
          id: 'coe', category: 'education', level: REQ,
          title: 'Confirmation of Enrolment (CoE)',
          desc: 'Issued by your education provider after you accept your offer and pay the deposit.',
        },
        {
          id: 'gs', category: 'education', level: REQ,
          title: 'Genuine Student (GS) responses',
          desc: 'Your answers about your circumstances, course choice and how it fits your future plans, with evidence to support them.',
        },
        {
          id: 'transcripts', category: 'education', level: REQ, translatable: true,
          title: 'Academic transcripts and certificates',
          desc: 'All previous qualifications relevant to your course.',
        },
        {
          id: 'english', category: 'education', level: REQ,
          title: 'English test results',
          desc: 'IELTS, PTE Academic, TOEFL iBT or another accepted test, unless you are exempt.',
        },
        {
          id: 'gap', category: 'education', level: REC, translatable: true,
          title: 'Evidence explaining any study gaps',
          desc: 'Employment references or other records covering periods when you were not studying.',
        },
        {
          id: 'funds', category: 'finance', level: REQ, translatable: true,
          title: 'Evidence of financial capacity',
          desc: 'Funds for course fees, living costs and travel for the first year, for example bank statements, an education loan sanction letter or a scholarship letter.',
        },
        {
          id: 'funds-sponsor', category: 'finance', level: REQ, translatable: true, when: (c) => c.sponsored,
          title: 'Sponsor’s financial documents and relationship proof',
          desc: 'Bank statements and income evidence for the person funding you, plus proof of how you are related.',
        },
        {
          id: 'oshc', category: 'health', level: REQ,
          title: 'Overseas Student Health Cover (OSHC)',
          desc: 'Must cover you for the whole visa period. Often arranged through your provider.',
        },
        health(REC, 'Often required depending on your country and circumstances. Home Affairs will tell you if you need a HAP ID.'),
        marriageCert(REQ),
        {
          id: 'child-birth', category: 'family', level: REQ, translatable: true, when: (c) => c.children,
          title: 'Birth certificates for dependent children',
          desc: 'Required for any child included in your application.',
        },
      ],
    },
    {
      id: 'partner',
      name: 'Partner visa',
      code: 'Subclass 820/801 · 309/100',
      blurb: 'For the spouse or de facto partner of an Australian citizen or PR.',
      profile: ['married', 'children', 'prevRefusal', 'nonEnglish'],
      toggleLabels: { married: 'We are married (leave off if you are de facto partners)' },
      links: [
        { label: 'Partner visa – onshore (820/801)', url: `${HA}/partner-onshore` },
        { label: 'Partner visa – offshore (309/100)', url: `${HA}/partner-offshore` },
      ],
      notes: [
        'Home Affairs assesses four aspects of your relationship: financial, household, social and commitment. Provide evidence for each one.',
        'Your sponsor must apply to be your sponsor and be approved.',
      ],
      items: [
        passport(),
        immi,
        photo,
        birthCert(),
        nameChange,
        prevRefusal(refusalDesc),
        {
          id: 'rel-married', category: 'relationship', level: REQ, translatable: true, when: (c) => c.married,
          title: 'Marriage certificate',
          desc: 'Your marriage must be valid under Australian law.',
        },
        {
          id: 'rel-defacto', category: 'relationship', level: REQ, translatable: true, when: (c) => !c.married,
          title: 'Evidence of your de facto relationship',
          desc: 'Usually at least 12 months living together, or registration of your relationship with an Australian state or territory.',
        },
        {
          id: 'rel-financial', category: 'relationship', level: REQ, translatable: true,
          title: 'Financial aspects of the relationship',
          desc: 'Joint bank accounts, shared bills, joint loans or property, and evidence that you share living costs.',
        },
        {
          id: 'rel-household', category: 'relationship', level: REQ, translatable: true,
          title: 'Nature of your household',
          desc: 'Joint lease or mortgage, mail to the same address, and how you share household duties.',
        },
        {
          id: 'rel-social', category: 'relationship', level: REQ,
          title: 'Social aspects of the relationship',
          desc: 'Photos together over time, joint invitations, travel together and evidence that friends and family know you as a couple.',
        },
        {
          id: 'rel-commitment', category: 'relationship', level: REQ,
          title: 'Commitment to each other',
          desc: 'Communication history while apart, time spent together, wills or insurance naming each other, and future plans.',
        },
        {
          id: 'rel-statements', category: 'relationship', level: REQ,
          title: 'Personal relationship statements from both partners',
          desc: 'How you met, how the relationship developed, and your plans together.',
        },
        {
          id: 'form-888', category: 'relationship', level: REQ,
          title: 'Form 888 statutory declarations (at least 2)',
          desc: 'Supporting statements from Australian citizens or permanent residents who know you as a couple.',
        },
        {
          id: 'prev-marriage', category: 'relationship', level: REC, translatable: true,
          title: 'Divorce or death certificates from previous relationships (if any)',
          desc: 'For either partner who has been married before.',
        },
        {
          id: 'sp-citizen', category: 'sponsor', level: REQ,
          title: 'Sponsor’s proof of Australian citizenship or PR',
          desc: 'Australian passport, citizenship certificate, birth certificate or PR visa grant.',
        },
        {
          id: 'sp-id', category: 'sponsor', level: REQ,
          title: 'Sponsor’s identity documents',
          desc: 'Photo ID such as a driver licence or passport.',
        },
        {
          id: 'sp-police', category: 'sponsor', level: REQ,
          title: 'Sponsor’s Australian police check',
          desc: 'Required in many cases, especially if children are included.',
        },
        policeCerts('From every country where you have lived for 12 months or more in the last 10 years since turning 16.'),
        health(REQ, 'All partner visa applicants must complete health examinations at a panel clinic.'),
        {
          id: 'child-birth', category: 'family', level: REQ, translatable: true, when: (c) => c.children,
          title: 'Birth certificates for dependent children',
          desc: 'Plus custody documents or Form 1229 if the other parent is not included.',
        },
      ],
    },
    {
      id: 'skilled',
      name: 'Skilled migration',
      code: 'Subclass 189 · 190 · 491',
      blurb: 'Points-tested permanent or provisional skilled visas.',
      profile: ['married', 'children', 'prevRefusal', 'nonEnglish'],
      links: [
        { label: 'Skilled Independent (189)', url: `${HA}/skilled-independent-189` },
        { label: 'Skilled Nominated (190)', url: `${HA}/skilled-nominated-190` },
        { label: 'Skilled Work Regional (491)', url: `${HA}/skilled-work-regional-provisional-491` },
      ],
      notes: [
        'Every points claim in your Expression of Interest must be backed by evidence when you lodge the visa.',
        'You usually have 60 days from invitation to lodge your application.',
      ],
      items: [
        passport(),
        immi,
        photo,
        birthCert(),
        nameChange,
        prevRefusal(refusalDesc),
        {
          id: 'invite', category: 'work', level: REQ,
          title: 'SkillSelect invitation',
          desc: 'Your Expression of Interest (EOI) and the invitation letter to apply.',
        },
        {
          id: 'nomination', category: 'work', level: REQ,
          title: 'State or territory nomination (190 / 491)',
          desc: 'The nomination approval, or a family sponsorship for the 491. Not needed for subclass 189.',
        },
        {
          id: 'skills-assessment', category: 'work', level: REQ,
          title: 'Positive skills assessment',
          desc: 'From the assessing authority for your nominated occupation.',
        },
        {
          id: 'english', category: 'work', level: REQ,
          title: 'English test results',
          desc: 'Results that match the English points you claimed.',
        },
        {
          id: 'references', category: 'work', level: REQ, translatable: true,
          title: 'Employment reference letters',
          desc: 'For every job you claim points for: duties, dates, hours per week and salary, on company letterhead.',
        },
        {
          id: 'work-proof', category: 'work', level: REQ, translatable: true,
          title: 'Evidence of paid employment',
          desc: 'Payslips, tax records, employment contracts or superannuation statements.',
        },
        {
          id: 'qualifications', category: 'education', level: REQ, translatable: true,
          title: 'Qualifications and academic transcripts',
          desc: 'Degrees, diplomas and transcripts for every qualification you claimed points for.',
        },
        {
          id: 'partner-skills', category: 'family', level: REC, translatable: true, when: (c) => c.married,
          title: 'Partner’s skills assessment or English results',
          desc: 'Only if you are claiming partner points.',
        },
        marriageCert(REQ),
        {
          id: 'child-birth', category: 'family', level: REQ, translatable: true, when: (c) => c.children,
          title: 'Birth certificates for dependent children',
          desc: 'For every child included in the application.',
        },
        policeCerts('From every country where you have lived for 12 months or more in the last 10 years since turning 16, for every applicant aged 16 or over.'),
        health(REQ, 'Required for you and every family member included in the application.'),
      ],
    },
  ],

  /** Notes that depend on the applicant's passport. */
  nationalityNotes(nat, visa) {
    if (!nat) return [];
    if (nat.code === 'AU') return [{ type: 'stop', text: 'Australian citizens don’t need a visa to enter Australia.' }];
    if (!visa?.visitor) return [];
    if (nat.au === 'SCV')
      return [{ type: 'info', text: 'New Zealand citizens usually receive a Special Category visa (subclass 444) on arrival, so a visitor visa is not normally needed.' }];
    if (nat.au === 'eVisitor')
      return [{ type: 'info', text: `As a ${nat.name} passport holder you may be eligible for a free eVisitor (subclass 651) for short visits. It needs far fewer documents.`, link: `${HA}/evisitor-651` }];
    if (nat.au === 'ETA')
      return [{ type: 'info', text: `As a ${nat.name} passport holder you may be eligible for an Electronic Travel Authority (subclass 601), applied for through the AustralianETA app.`, link: `${HA}/electronic-travel-authority-601` }];
    return [];
  },
};
