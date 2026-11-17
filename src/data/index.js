import australia from './australia.js';
import uk from './uk.js';
import usa from './usa.js';

/**
 * Destination registry. To add a country:
 *   1. Copy one of the country files (e.g. uk.js) to newcountry.js
 *   2. Edit visa types, items, translationRule and nationalityNotes
 *   3. Import it here and add it to the array
 */
export const DESTINATIONS = [australia, uk, usa];

export const getDestination = (id) => DESTINATIONS.find((d) => d.id === id) || null;

export const LAST_REVIEWED = 'November 2026';
