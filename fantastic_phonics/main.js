import { alphabet_chant } from './data/alphabet_chant.js';
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

const schedule = [];

while (date < endDate) {
  const row = {
    date_iso: date.toISOString().substring(0, 10),
    date: date.getTime()
  };
  // row.date = date.toISOString();
  // row.date = date.toISODate();
  // row.date = date.toISOString().substring(0, 10);
  // row.date = date;

  schedule.push(row);

  date.setDate(date.getDate() + 1);
}

log(schedule);

const frag = document.createDocumentFragment();
schedule.forEach( row => {
  const date = new Date(row.date);

  const month = date.toLocaleString('default', { month: 'short' });
  const weekday = date.toLocaleString('default', {  weekday: 'short' });
  
  const p = document.createElement('p');
  p.textContent = `${date.getFullYear()} ${month} ${date.getDate()} - ${weekday}`;
  
  frag.appendChild(p);
});

document.body.appendChild(frag);



//// Oh, how I long for Temporal... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal