import { usagi_vocab } from './data/usagi_vocab.js'; // 141 items
import { alphabet_chant } from './data/alphabet_chant.js'; // 5 items
import { letter_search } from './data/letter_search.js'; // 141 items
import { fp_adventure } from './data/fp_adventure.js'; // 19 items

const log = console.log;


//// Settings

const startYearMonth = { year: 2025, month: 'april' }; //// month must be full name, not number, capitalisation is ignored
const durationMonths = 12;


//////// Schedule creation

// Init blank schedule
const schedule = [];

// Arrays to keep track of what *indexes* have been previously chosen (to avoid nearby repeats)
const used = {
  vocab: [],
  chant: [],
  search: [], //// every 2-5 days this should be an ADVENTURE!
  adventure: [],
  adventure_days: 0
}

// Generate functional dates
const date = new Date(`${startYearMonth.year} ${startYearMonth.month} 1`);
const endDate = new Date(new Date(date).setMonth(date.getMonth() + durationMonths)); //// Thanks https://stackoverflow.com/a/5645110/6270906 - How we long for the Temporal API... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal

// Loop through every day between `date` and `endDate`, incrementing `date` each loop
while (date < endDate) {

  // Choose a random index for each of the source arrays
  const vocabIndex     = chooseIndex(usagi_vocab,    used.vocab,     30);
  const chantIndex     = chooseIndex(alphabet_chant, used.chant,     2);
  const searchIndex    = chooseIndex(letter_search,  used.search,    30);
  const adventureIndex = chooseIndex(fp_adventure,   used.adventure, 7);

  // Use those indexes to pull in the actual data for current day (and set the date)
  const day = {
    date:      date.getTime(), //// Store date as Unix epoch
    vocab:     usagi_vocab[vocabIndex],
    chant:     alphabet_chant[chantIndex],
    search:    letter_search[searchIndex],
    adventure: fp_adventure[adventureIndex]
  };

  // Add current day to end of the schedule array
  schedule.push(day);

  // used.adv_days += 1;

  // Increment date
  date.setDate(date.getDate() + 1);
}


function chooseIndex(sourceArray, usedArray, numberToSpliceWhenFull) {

  // If all [sourceArray] items have been previously chosen, remove the oldest [n] from front of [usedArray] with `splice()`
  if (usedArray.length >= sourceArray.length) usedArray.splice(0, numberToSpliceWhenFull);

  // Choose a random index while excluding those previously chosen
  const chosen = randomIndexExclude(sourceArray, usedArray);

  // Keep track of what's been chosen by storing its index in the given [usedArray]
  usedArray.push(chosen);

  // Return chosen index
  return chosen;
}


function randomIndexExclude(array, excludeArray) {
  let chosen = null;
  while (chosen === null) {
    const candidate = Math.floor(Math.random() * array.length | 0);
    if (excludeArray.indexOf(candidate) === -1) chosen = candidate;
  }
  return chosen;
}

log(schedule);


//////// Output to page

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
  vocabSpan.textContent = `Vocab: ${row.vocab.object.letter} - ${row.vocab.object.word}`;
  p.appendChild(vocabSpan);

  const chantSpan = document.createElement('span');
  chantSpan.textContent = `Chant: ${row.chant}`;
  p.appendChild(chantSpan);

  const searchSpan = document.createElement('span');
  searchSpan.textContent = `Search: ${row.search.word} - ${row.search.video}`;
  p.appendChild(searchSpan);

  const adventureSpan = document.createElement('span');
  adventureSpan.textContent = `Adventure: ${row.adventure.word}`;
  p.appendChild(adventureSpan);
  
  frag.appendChild(p);
});

document.body.appendChild(frag);
