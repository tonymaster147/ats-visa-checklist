import { CATEGORIES } from '../data/common.js';

export const WEIGHTS = { required: 3, recommended: 1 };

/** Filter a visa type's items for the applicant's profile and group them by category. */
export function buildChecklist(destination, visa, nationality, profile) {
  const ctx = { ...profile, nationality };
  const items = visa.items
    .filter((item) => !item.when || item.when(ctx))
    .map((item) => ({ ...item, needsTranslation: Boolean(profile.nonEnglish && item.translatable) }));

  const order = Object.keys(CATEGORIES);
  const groups = order
    .map((key) => ({ key, ...CATEGORIES[key], items: items.filter((i) => i.category === key) }))
    .filter((g) => g.items.length);

  const notes = [
    ...(destination.nationalityNotes?.(nationality, visa) || []),
    ...(visa.notes || []).map((text) => ({ type: 'tip', text })),
  ];

  return { items, groups, notes };
}

/** Weighted readiness score: required docs count 3×, recommended 1×. */
export function scoreChecklist(items, checked) {
  let total = 0;
  let done = 0;
  const counts = { required: [0, 0], recommended: [0, 0] };
  for (const item of items) {
    const w = WEIGHTS[item.level];
    total += w;
    counts[item.level][1] += 1;
    if (checked[item.id]) {
      done += w;
      counts[item.level][0] += 1;
    }
  }
  const pct = total ? Math.round((done / total) * 100) : 0;
  const missingRequired = items.filter((i) => i.level === 'required' && !checked[i.id]);
  return { pct, counts, missingRequired, band: band(pct, missingRequired.length) };
}

function band(pct, missingReq) {
  if (pct === 100) return { key: 'ready', label: 'Ready to apply', text: 'All documents on your checklist are ready.' };
  if (missingReq === 0) return { key: 'strong', label: 'Strong application', text: 'All required documents are ready. Recommended extras will strengthen it further.' };
  if (pct >= 70) return { key: 'almost', label: 'Almost there', text: `Just ${missingReq} required document${missingReq > 1 ? 's' : ''} to go.` };
  if (pct >= 35) return { key: 'progress', label: 'Making progress', text: 'Keep going. Focus on the required documents first.' };
  return { key: 'start', label: 'Getting started', text: 'Tick documents off as you collect them to raise your score.' };
}
