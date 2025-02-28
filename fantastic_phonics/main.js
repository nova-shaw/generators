import { usagi_vocab as vocab } from './data/usagi_vocab.js'; // 141 items
import { fp_adventure as adv } from './data/fp_adventure.js'; // 19 items
import { letter_search as search } from './data/letter_search.js'; // 141 items
import { alphabet_chant as chant } from './data/alphabet_chant.js'; // 5 items


//// Settings

const startYearMonth = { year: 2025, month: 'april' }; //// month must be full name, not number, capitalisation is ignored
const durationMonths = 12;


//// Internals

const log = console.log;

const date = new Date(`${startYearMonth.year} ${startYearMonth.month} 1`);
const endDate = new Date(`${startYearMonth.year+1} ${startYearMonth.month} 1`);

const schedule = [];

const used = {
  vocab:  [],
  chant:  [],
  search: [], //// every 2-5 days this should be an ADVENTURE!
  adv:  [],
  adv_days: 0
}

while (date < endDate) {

  /*const vocabIndex = randomIndexExclude(vocab, used.vocab);
  used.vocab.push(vocabIndex);*/

  /*if (used.chant.length == chant.length) {
    chantIndex = used.chant.shift()
  } else {
    chantIndex = randomIndexExclude(chant, used.chant);
  }*/

  // const chantIndex = (used.chant.length == chant.length) ? used.chant.shift() : randomIndexExclude(chant, used.chant);
  // used.chant.push(chantIndex);

  // log(used.chant);
  log(randomIndexExclude([2,3,4,5,6], [3,4]));

  /*const searchIndex = randomIndexExclude(search, used.search);
  used.search.push(searchIndex);*/


  const row = {
    date: date.getTime(),

    vocab: null,
    // chant: chant[chantIndex],
    search: null
  };

  schedule.push(row);

  used.adv_days += 1;
  date.setDate(date.getDate() + 1); //// Oh, how I long for the Temporal API... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal


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




function randomIndexExclude(array, excludeArray) {
  let chosen = null;
  while (chosen === null) {
    const candidate = Math.floor(Math.random() * array.length | 0);
    if (excludeArray.indexOf(candidate) === -1) chosen = candidate;
  }
  return chosen;
}