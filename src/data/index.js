import australia from './australia.js';
// UK and US are ready but hidden for now. To re-enable, uncomment the imports
// and add them back to the DESTINATIONS array below.
// import uk from './uk.js';
// import usa from './usa.js';

/**
 * Destination registry. To add a country:
 *   1. Copy one of the country files (e.g. uk.js) to newcountry.js
 *   2. Edit visa types, items, translationRule and nationalityNotes
 *   3. Import it here and add it to the array
 */
export const DESTINATIONS = [australia];

export const getDestination = (id) => DESTINATIONS.find((d) => d.id === id) || null;

export const LAST_REVIEWED = 'November 2026';
