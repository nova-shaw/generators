import { usagi_vocab } from './data/usagi_vocab.js'; // 141 items
import { alphabet_chant } from './data/alphabet_chant.js'; // 5 items
import { letter_search } from './data/letter_search.js'; // 141 items
import { fp_adventure } from './data/fp_adventure.js'; // 19 items


//////// Interface

const btnGenerate = document.querySelector('#btn_generate');
btnGenerate.addEventListener('click', generateSchedule);


//////// Run on page load

generateSchedule();


//////// Schedule creation

function generateSchedule() {

  // Gather the settings from the UI
  const inputStart = document.querySelector('#input_start');
  const inputMonths = document.querySelector('#input_months');
  const start = inputStart.value
  const months = Number(inputMonths.value); // Careful of strings that *look* like numbers

  // Generate functional dates from them
  const date = new Date(`${start}-01`);
  const endDate = new Date(new Date(date).setMonth(date.getMonth() + months)); //// Thanks https://stackoverflow.com/a/5645110/6270906 - How we long for the Temporal API... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal

  // Init blank schedule
  const schedule = [];

  // Arrays to keep track of what *indexes* have been previously chosen (to avoid nearby repeats)
  const used = {
    vocab: [],
    chant: [],
    search: [], //// every 2-5 days this should be an ADVENTURE!
    adventure: []
  }

  // Keep track of the last 'adventure' day, randomly assign a new 'gap' each time [2-5 inclusive]
  const spacing = {
    adventure: { last: 0, gap: 3 }
  }

  // Loop through every day between `date` and `endDate`, incrementing `date` each loop
  while (date < endDate) {

    // Prep data structure
    const day = {
      date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`, // Build our own date string to ensure consistency [2025-4-3]
      epoch: date.getTime(), //// Also store date as Unix epoch just in case
      weekday: date.getDay(),
      vocab: null,
      chant: null,
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

  // When done, send to output function
  outputSchedule(schedule);
}


//////// Schedule creation HELPERS

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



//////// Schedule output (to existing table)

function outputSchedule(schedule) {
  
  // First, spit out the JSON to the UI
  const codeOutput = document.querySelector('#text_output');
  codeOutput.value = JSON.stringify(schedule);

  // Then report the number of choices in each source array
  const countVocab     = document.querySelector('#count-vocab');
  const countChant     = document.querySelector('#count-chant');
  const countSearch    = document.querySelector('#count-search');
  const countAdventure = document.querySelector('#count-adventure');
  countVocab.textContent     = usagi_vocab.length;
  countChant.textContent     = alphabet_chant.length;
  countSearch.textContent    = letter_search.length;
  countAdventure.textContent = fp_adventure.length;

  // Finally, begin building the new table (tbody only)
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
  
  // Once new tbody is built, replace the existing tbody with it
  const tbodyExisting = document.querySelector('#schedule-table tbody');
  tbodyExisting.replaceWith(tbody);
}






