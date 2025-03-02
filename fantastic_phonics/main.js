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

  // Prep data structure
  const day = {
    date:   date.getTime(), //// Store date as Unix epoch
    weekday: date.getDay(),
    vocab:  null,
    chant:  null,
    hunt: { type: null, data: null } 
  };

  // Choose a random index for the source arrays that are always needed
  const vocabIndex = chooseIndex(usagi_vocab,    used.vocab, 30);
  const chantIndex = chooseIndex(alphabet_chant, used.chant, 2);

  // Use those indexes to pull in the actual data for current day (and set the date)
  day.vocab = usagi_vocab[vocabIndex];
  day.chant = alphabet_chant[chantIndex];

  // 'Hunt' switches between 'search' and 'adventure' at a random interval between 2-5 days
  if (spacing.adventure.last == spacing.adventure.gap) {

    // Set type ADVENTURE
    day.hunt.type = 'adventure';

    // Choose a random index for 'adventure' array
    const adventureIndex = chooseIndex(fp_adventure, used.adventure, 7);
    day.hunt.data = fp_adventure[adventureIndex];

    // Reset days since last adventure, choose next adventure gap
    spacing.adventure.last = 0;
    spacing.adventure.gap  = randomIntegerInclusive(2, 5);

  } else {

    // Set type SEARCH
    day.hunt.type = 'search';

    // Choose a random index for 'adventure' array
    const searchIndex = chooseIndex(letter_search, used.search, 30);
    day.hunt.data = letter_search[searchIndex];

    // Increment days since last adventure
    spacing.adventure.last += 1;
  }

  // Add current day to end of the schedule array
  schedule.push(day);

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

const output = document.querySelector('#text_output');
// log(JSON.stringify(schedule));
output.value = JSON.stringify(schedule);


//////// Output to page as a table (Aaaaaah!)

const table = document.createElement('table');
const thead = document.createElement('thead');
const headRow = document.createElement('tr');

const weekdayHead = document.createElement('th');
weekdayHead.textContent = 'Day';
headRow.appendChild(weekdayHead);

const dateHead = document.createElement('th');
dateHead.textContent = 'Date';
headRow.appendChild(dateHead);

const vocabHead = document.createElement('th');
vocabHead.textContent = `Vocab [${usagi_vocab.length}]`;
headRow.appendChild(vocabHead);

const chantHead = document.createElement('th');
chantHead.textContent = `Chant [${alphabet_chant.length}]`;
headRow.appendChild(chantHead);

const huntHead = document.createElement('th');
huntHead.textContent = '';
huntHead.textContent = `Search [${letter_search.length}] Adventure [${fp_adventure.length}]`;
headRow.appendChild(huntHead);


thead.appendChild(headRow);
table.appendChild(thead);

const tbody = document.createElement('tbody');

schedule.forEach( item => {

  const date = new Date(item.date);

  const tr = document.createElement('tr');
  tr.classList.toggle('sunday', date.getDay() === 0);

  const weekdayCell = document.createElement('td');
  weekdayCell.classList.add('weekday');
  weekdayCell.textContent = date.toLocaleString('default', {  weekday: 'short' });
  tr.appendChild(weekdayCell);

  const dateCell = document.createElement('td');
  dateCell.classList.add('date');
  const month = date.toLocaleString('default', { month: 'short' });
  dateCell.textContent = `${date.getFullYear()} ${month} ${date.getDate()}`;
  tr.appendChild(dateCell);

  const vocabCell = document.createElement('td');
  vocabCell.classList.add('vocab');
  vocabCell.textContent = `${item.vocab.object.letter} - ${item.vocab.object.word}`;
  tr.appendChild(vocabCell);

  const chantCell = document.createElement('td');
  chantCell.classList.add('chant');
  chantCell.textContent = `${item.chant}`;
  tr.appendChild(chantCell);

  const huntCell = document.createElement('td');
  huntCell.textContent = `${item.hunt.type}: `;
  huntCell.classList.add(`type-${item.hunt.type}`);

  const huntContentSpan = document.createElement('span');
  if (item.hunt.type == 'adventure') {
    huntContentSpan.textContent = `${item.hunt.data.word}`;
  } else {
    huntContentSpan.textContent = `${item.hunt.data.word} - ${item.hunt.data.video}`;
  }
  huntCell.appendChild(huntContentSpan);

  tr.appendChild(huntCell);

  tbody.appendChild(tr);
});

table.appendChild(tbody);
const main = document.querySelector('main')
main.appendChild(table);
