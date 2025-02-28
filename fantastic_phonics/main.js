import { usagi_vocab } from './data/usagi_vocab.js'; // 141 items
import { fp_adventure } from './data/fp_adventure.js'; // 19 items
import { letter_search } from './data/letter_search.js'; // 141 items
import { alphabet_chant } from './data/alphabet_chant.js'; // 5 items


//// Settings

const startYearMonth = { year: 2025, month: 'april' }; //// month must be full name, not number, capitalisation is ignored
const durationMonths = 12;


//// Internals

const log = console.log;

const date = new Date(`${startYearMonth.year} ${startYearMonth.month} 1`);
const endDate = new Date(new Date(date).setMonth(date.getMonth() + durationMonths)); //// Thanks https://stackoverflow.com/a/5645110/6270906 - How we long for the Temporal API... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal

const schedule = [];

const used = {
  vocab:  [],
  chant:  [],
  search: [], //// every 2-5 days this should be an ADVENTURE!
  adventure: [],
  adventure_days: 0
}

while (date < endDate) {

  //// If all [usagi_vocab] have been used, remove the oldest [30] from used list
  if (used.vocab.length >= usagi_vocab.length) used.vocab.splice(0, 30);
  const vocabIndex = randomIndexExclude(usagi_vocab, used.vocab);
  used.vocab.push(vocabIndex);

  //// If all [alphabet_chant] have been used, remove the oldest [3] from used list
  if (used.chant.length >= alphabet_chant.length) used.chant.splice(0, 3);
  const chantIndex = randomIndexExclude(alphabet_chant, used.chant);
  used.chant.push(chantIndex);

  //// If all [letter_search] have been used, remove the oldest [30] from used list
  if (used.search.length >= letter_search.length) used.search.splice(0, 30);
  const searchIndex = randomIndexExclude(letter_search, used.search);
  used.search.push(searchIndex);

  //// If all [fp_adventure] have been used, remove the oldest [7] from used list
  if (used.adventure.length >= fp_adventure.length) used.adventure.splice(0, 7);
  const adventureIndex = randomIndexExclude(fp_adventure, used.adventure);
  used.adventure.push(adventureIndex);

  const row = {
    date: date.getTime(), //// Store date as Unix epoch
    vocab: usagi_vocab[vocabIndex],
    chant: alphabet_chant[chantIndex],
    search: letter_search[searchIndex],
    adventure: fp_adventure[adventureIndex]
  };

  schedule.push(row);

  used.adv_days += 1;
  date.setDate(date.getDate() + 1);


}

log(schedule);

const frag = document.createDocumentFragment();
schedule.forEach( row => {
  const p = document.createElement('p');

  const dateSpan = document.createElement('span');
  const date = new Date(row.date);
  const month = date.toLocaleString('default', { month: 'short' });
  const weekday = date.toLocaleString('default', {  weekday: 'short' });
  dateSpan.textContent = `${date.getFullYear()} ${month} ${date.getDate()} - ${weekday}`;
  p.appendChild(dateSpan);

  const vocabSpan = document.createElement('span');
  vocabSpan.textContent = `${row.vocab.object.letter} - ${row.vocab.object.word}`;
  p.appendChild(vocabSpan);

  const searchSpan = document.createElement('span');
  searchSpan.textContent = `${row.search.word} - ${row.search.video}`;
  p.appendChild(searchSpan);
  
  frag.appendChild(p);
});

document.body.appendChild(frag);

log(used.vocab)



function randomIndexExclude(array, excludeArray) {
  let chosen = null;
  while (chosen === null) {
    const candidate = Math.floor(Math.random() * array.length | 0);
    if (excludeArray.indexOf(candidate) === -1) chosen = candidate;
  }
  return chosen;
}