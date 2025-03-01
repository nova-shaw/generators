import { usagi_vocab } from './data/usagi_vocab.js'; // 141 items
import { alphabet_chant } from './data/alphabet_chant.js'; // 5 items
import { letter_search } from './data/letter_search.js'; // 141 items
import { fp_adventure } from './data/fp_adventure.js'; // 19 items

const log = console.log;


//// Settings

const startYearMonth = { year: 2025, month: 'april' }; //// month must be full name, not number, capitalisation is ignored
const durationMonths = 1;


//////// Schedule creation

// Init blank schedule
const schedule = [];

// Arrays to keep track of what *indexes* have been previously chosen (to avoid nearby repeats)
const used = {
  vocab: [],
  chant: [],
  search: [], //// every 2-5 days this should be an ADVENTURE!
  adventure: []
}

const spacing = {
  adventure: { last: 0, gap: 3 }
}

// Generate functional dates
const date = new Date(`${startYearMonth.year} ${startYearMonth.month} 1`);
const endDate = new Date(new Date(date).setMonth(date.getMonth() + durationMonths)); //// Thanks https://stackoverflow.com/a/5645110/6270906 - How we long for the Temporal API... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal

// Loop through every day between `date` and `endDate`, incrementing `date` each loop
while (date < endDate) {

  // Prep day data structure
  const day = {
    date:   date.getTime(), //// Store date as Unix epoch
    weekday: date.getDay(),
    vocab:  null,
    chant:  null,
    // search: null,
    hunt: { type: null, data: null } 
  };

  // Choose a random index for the source arrays that are always needed
  const vocabIndex = chooseIndex(usagi_vocab,    used.vocab, 30);
  const chantIndex = chooseIndex(alphabet_chant, used.chant, 2);

  // Use those indexes to pull in the actual data for current day (and set the date)
  day.vocab = usagi_vocab[vocabIndex];
  day.chant = alphabet_chant[chantIndex];



  // 'search' is sometimes 'adventure'
  // if (spacing.adventure.last == null || date - spacing.adventure.last == spacing.adventure.gap) {
  if (spacing.adventure.last == spacing.adventure.gap) {

    // log('adventure');
    day.hunt.type = 'adventure';

    // Choose a random index for 'adventure' array
    const adventureIndex = chooseIndex(fp_adventure, used.adventure, 7);
    day.hunt.data = fp_adventure[adventureIndex];

    // Reset days since last adventure
    spacing.adventure.last = 0;
    
    // Choose next adventure gap
    spacing.adventure.gap  = randomIntegerInclusive(2, 5);


  // 'search' is sometimes just a 'search'
  } else {

    day.hunt.type = 'search';

    // Choose a random index for 'adventure' array
    const searchIndex = chooseIndex(letter_search, used.search, 30);
    day.hunt.data = letter_search[searchIndex];
  }

  // Add current day to end of the schedule array
  schedule.push(day);

  // Increment days since last adventure
  spacing.adventure.last += 1;

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
    // const candidate = Math.floor(Math.random() * array.length | 0);
    const candidate = randomIntegerInclusive(0, array.length - 1);
    if (excludeArray.indexOf(candidate) === -1) chosen = candidate;
  }
  return chosen;
}

function randomIntegerInclusive(min, max) { // Thanks https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
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
  p.classList.toggle('sunday', date.getDay() === 0);
  p.appendChild(dateSpan);

  const vocabSpan = document.createElement('span');
  vocabSpan.classList.add('vocab');
  vocabSpan.textContent = `Vocab: ${row.vocab.object.letter} - ${row.vocab.object.word}`;
  p.appendChild(vocabSpan);

  const chantSpan = document.createElement('span');
  chantSpan.classList.add('chant');
  chantSpan.textContent = `Chant: ${row.chant}`;
  p.appendChild(chantSpan);

  /*
  const searchSpan = document.createElement('span');
  searchSpan.textContent = `Search: ${row.search.word} - ${row.search.video}`;
  p.appendChild(searchSpan);

  const adventureSpan = document.createElement('span');
  adventureSpan.textContent = `Adventure: ${row.adventure.word}`;
  p.appendChild(adventureSpan);*/

  const huntSpan = document.createElement('span');
  huntSpan.textContent = `${row.hunt.type}: `;
  huntSpan.classList.add(`type-${row.hunt.type}`);

  const huntContentSpan = document.createElement('span');
  if (row.hunt.type == 'adventure') {
    huntContentSpan.textContent = `${row.hunt.data.word}`;
  } else {
    huntContentSpan.textContent = `${row.hunt.data.word} - ${row.hunt.data.video}`;
  }
  huntSpan.appendChild(huntContentSpan);

  p.appendChild(huntSpan);


  
  frag.appendChild(p);
});

document.body.appendChild(frag);
