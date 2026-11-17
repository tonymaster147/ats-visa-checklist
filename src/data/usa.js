import {
  REQ, REC, employmentEvidence, homeTies, visitorSponsor, marriageCert, childrenDocs, prevRefusal,
} from './common.js';

const TSG = 'https://travel.state.gov/content/travel/en/us-visas';

const ds160 = {
  id: 'ds160', category: 'identity', level: REQ,
  title: 'DS-160 confirmation page',
  desc: 'Print the confirmation page with the barcode after you submit the online form.',
};
const passport = {
  id: 'passport', category: 'identity', level: REQ,
  title: 'Passport valid for at least 6 months beyond your stay',
  desc: 'Unless your country has an agreement exempting you from the 6-month rule. Bring old passports with previous US visas too.',
};
const photo = {
  id: 'photo', category: 'identity', level: REQ,
  title: 'Photo, 2 × 2 inches (51 × 51 mm)',
  desc: 'Colour, white background, taken in the last 6 months, no glasses. Uploaded with your DS-160.',
};
const fee = {
  id: 'mrv-fee', category: 'identity', level: REQ,
  title: 'Visa application (MRV) fee receipt',
  desc: 'Proof you have paid the non-refundable application fee.',
};
const appointment = {
  id: 'appointment', category: 'identity', level: REQ,
  title: 'Interview appointment confirmation',
  desc: 'Print the appointment letter for your consular interview.',
};
const refusal = prevRefusal('Officers can see past refusals. Bring the refusal letter (e.g. a 214(b) letter) and be ready to explain what has changed.');

export default {
  id: 'us',
  name: 'United States',
  flag: 'us',
  authority: 'U.S. Department of State / USCIS',
  translationRule:
    'US authorities require a full English translation of any foreign-language document. The translator must certify that they are competent to translate and that the translation is complete and accurate.',
  visaTypes: [
    {
      id: 'b1b2',
      name: 'Visitor visa',
      code: 'B-1 / B-2',
      blurb: 'Tourism, visiting family, medical treatment or business meetings.',
      profile: ['employment', 'sponsored', 'married', 'children', 'prevRefusal', 'nonEnglish'],
      visitor: true,
      links: [{ label: 'Visitor visa (B-1/B-2)', url: `${TSG}/tourism-visit/visitor.html` }],
      notes: [
        'Under section 214(b) the officer presumes you intend to immigrate. Your documents and interview must show strong ties to home.',
        'Officers may not look at every document. Bring them organised and be ready to answer clearly.',
      ],
      items: [
        passport, ds160, photo, fee, appointment, refusal,
        {
          id: 'bank', category: 'finance', level: REC, translatable: true,
          title: 'Bank statements (last 3–6 months)',
          desc: 'Shows you can pay for your trip.',
        },
        ...employmentEvidence(),
        ...homeTies(),
        ...visitorSponsor('From the person you are visiting: their status in the US, address, your relationship, purpose and length of your visit.'),
        {
          id: 'itinerary', category: 'travel', level: REC,
          title: 'Trip plan or itinerary',
          desc: 'Where you will go, for how long, and where you will stay.',
        },
        {
          id: 'business-letter', category: 'purpose', level: REC,
          title: 'Business invitation or employer letter (B-1 only)',
          desc: 'Purpose of the business trip and who is paying.',
        },
        {
          id: 'medical', category: 'purpose', level: REC, translatable: true,
          title: 'Medical documents (medical treatment only)',
          desc: 'Doctor’s diagnosis, a letter from the US hospital and proof you can pay for treatment.',
        },
        marriageCert(),
        ...childrenDocs('A notarised consent letter from any parent not travelling, with a copy of their ID.'),
      ],
    },
    {
      id: 'f1',
      name: 'Student visa',
      code: 'F-1',
      blurb: 'Academic study at a SEVP-certified US school.',
      profile: ['sponsored', 'married', 'children', 'prevRefusal', 'nonEnglish'],
      links: [{ label: 'Student visa', url: `${TSG}/study/student-visa.html` }],
      notes: ['You can be issued an F-1 visa up to 365 days before your program start date, but you can enter the US only 30 days before it.'],
      items: [
        passport, ds160, photo, fee, appointment, refusal,
        {
          id: 'i20', category: 'education', level: REQ,
          title: 'Form I-20 signed by you and your school',
          desc: 'Issued by your school’s Designated School Official (DSO).',
        },
        {
          id: 'sevis', category: 'education', level: REQ,
          title: 'SEVIS I-901 fee payment receipt',
          desc: 'Pay this before your visa interview.',
        },
        {
          id: 'transcripts', category: 'education', level: REQ, translatable: true,
          title: 'Academic transcripts, diplomas and certificates',
          desc: 'From the schools you have attended.',
        },
        {
          id: 'tests', category: 'education', level: REC,
          title: 'Standardised test scores',
          desc: 'TOEFL / IELTS, and SAT, GRE or GMAT as required by your school.',
        },
        {
          id: 'funds', category: 'finance', level: REQ, translatable: true,
          title: 'Proof of funds for at least the first year',
          desc: 'Must cover the cost shown on your I-20: bank statements, scholarship or loan letters.',
        },
        {
          id: 'funds-sponsor', category: 'finance', level: REQ, translatable: true, when: (c) => c.sponsored,
          title: 'Sponsor’s letter and financial documents',
          desc: 'A letter of support, bank statements and income proof from the person paying for your studies.',
        },
        {
          id: 'ties', category: 'employment', level: REC, translatable: true,
          title: 'Evidence of intent to return home',
          desc: 'Family ties, property, or job prospects after you graduate.',
        },
        marriageCert(REQ),
        {
          id: 'child-birth', category: 'family', level: REQ, translatable: true, when: (c) => c.children,
          title: 'Birth certificates for F-2 dependants',
          desc: 'Each dependant needs their own I-20 from your school.',
        },
      ],
    },
    {
      id: 'spouse',
      name: 'Spouse immigrant visa',
      code: 'CR-1 / IR-1',
      blurb: 'For the husband or wife of a US citizen.',
      profile: ['children', 'prevRefusal', 'nonEnglish'],
      links: [{ label: 'Family immigration', url: `${TSG}/immigrate/family-immigration.html` }],
      notes: [
        'This visa starts with your spouse filing Form I-130 with USCIS. Your case then moves to the National Visa Center (NVC).',
        'Civil documents must meet the reciprocity requirements for your country. Check the Department of State’s reciprocity page.',
      ],
      items: [
        passport, photo,
        refusal,
        {
          id: 'i130', category: 'sponsor', level: REQ,
          title: 'I-130 approval notice (Form I-797)',
          desc: 'Issued by USCIS when the petition is approved.',
        },
        {
          id: 'ds260', category: 'identity', level: REQ,
          title: 'DS-260 confirmation page',
          desc: 'The online immigrant visa application submitted through the CEAC portal.',
        },
        {
          id: 'i864', category: 'sponsor', level: REQ,
          title: 'Form I-864 Affidavit of Support',
          desc: 'Signed by your US citizen spouse. A joint sponsor is needed if their income is too low.',
        },
        {
          id: 'tax', category: 'sponsor', level: REQ,
          title: 'Petitioner’s latest federal tax return or IRS transcript',
          desc: 'Plus W-2s or 1099s to support the I-864.',
        },
        {
          id: 'domicile', category: 'sponsor', level: REQ,
          title: 'Petitioner’s proof of US citizenship and domicile',
          desc: 'US passport or naturalisation certificate, and evidence they live in, or will return to, the US.',
        },
        {
          id: 'birth-cert', category: 'identity', level: REQ, translatable: true,
          title: 'Birth certificate',
          desc: 'Must meet the Department of State reciprocity requirements for your country.',
        },
        {
          id: 'marriage', category: 'relationship', level: REQ, translatable: true,
          title: 'Marriage certificate',
          desc: 'Official civil record of your marriage.',
        },
        {
          id: 'prev-marriage', category: 'relationship', level: REC, translatable: true,
          title: 'Proof prior marriages ended (if any)',
          desc: 'Divorce decrees, annulment or death certificates.',
        },
        {
          id: 'bona-fide', category: 'relationship', level: REQ,
          title: 'Evidence of a genuine (bona fide) marriage',
          desc: 'Photos together, communication history, joint finances or property, and travel records.',
        },
        {
          id: 'police', category: 'health', level: REQ, translatable: true,
          title: 'Police certificates',
          desc: 'From your country of nationality and any country where you lived for more than 6 months since age 16 (rules vary by country).',
        },
        {
          id: 'court', category: 'health', level: REC, translatable: true,
          title: 'Court, prison or military records (if applicable)',
          desc: 'Required if you have been convicted of a crime or served in the military.',
        },
        {
          id: 'medical', category: 'health', level: REQ,
          title: 'Medical examination by a panel physician',
          desc: 'Including required vaccinations. Results go directly to the embassy.',
        },
        {
          id: 'child-birth', category: 'family', level: REQ, translatable: true, when: (c) => c.children,
          title: 'Children’s birth certificates',
          desc: 'Eligible children may need their own petition or visa. Check your case.',
        },
      ],
    },
  ],

  nationalityNotes(nat, visa) {
    if (!nat) return [];
    if (nat.code === 'US') return [{ type: 'stop', text: 'US citizens don’t need a visa to enter the United States.' }];
    if (!visa?.visitor) return [];
    if (nat.us === 'NONE')
      return [{ type: 'info', text: 'Canadian citizens generally don’t need a visa or ESTA for short visits to the US.' }];
    if (nat.us === 'ESTA')
      return [{ type: 'info', text: `As a ${nat.name} passport holder you may be able to visit for up to 90 days under the Visa Waiver Program with an approved ESTA instead of a visa.`, link: 'https://esta.cbp.dhs.gov/' }];
    return [];
  },
};
