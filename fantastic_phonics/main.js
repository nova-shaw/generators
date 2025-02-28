import { usagi_vocab } from './data/usagi_vocab.js';
import { fp_adventure } from './data/fp_adventure.js';
import { letter_search } from './data/letter_search.js';


//// Settings

const startYearMonth = { year: 2025, month: 'april' }; //// month must be full name, not number, capitalisation is ignored
const durationMonths = 12;


//// Internals

const log = console.log;

const date = new Date(`${startYearMonth.year} ${startYearMonth.month} 1`);
const endDate = new Date(`${startYearMonth.year+1} ${startYearMonth.month} 1`);


const frag = document.createDocumentFragment();
while (date < endDate) {
  const p = document.createElement('p');

  const month = date.toLocaleString('default', { month: 'short' });
  const weekday = date.toLocaleString('default', {  weekday: 'short' });
  p.textContent = `${date.getFullYear()} ${month} ${date.getDate()} - ${weekday}`;

  frag.appendChild(p);
  
  date.setDate(date.getDate() + 1);
}

document.body.appendChild(frag);



//// Oh, how I long for Temporal... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal