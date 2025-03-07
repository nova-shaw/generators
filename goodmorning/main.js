import { door_colors } from './data/door_colors.js'; // 7 items
import { hello_songs } from './data/hello_songs.js'; // 4 items
import { lets_exercise } from './data/lets_exercise.js'; // 5 items
import { window_shapes } from './data/window_shapes.js'; // 4 items
import { todays_lesson } from './data/todays_lesson.js'; // 7 categories (between 2 and 23 items each)
import { transition_phonics } from './data/transition_phonics.js'; // 5 items
// Clock thing - What time is it?
import { stories } from './data/stories.js'; // 9 series (between 5 and 11 episodes each)
import { goodbyes } from './data/goodbyes.js'; // 3 items


const log = console.log;

log('door_colors', door_colors); // color
log('hello_songs', hello_songs); // song
log('lets_exercise', lets_exercise); // exerc
log('window_shapes', window_shapes); // shape
log('todays_lesson', todays_lesson); // today
log('transition_phonics', transition_phonics); // trans
log('stories', stories); // story
log('goodbyes', goodbyes); // goodbye


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
    color: [],
    song: [],
    exerc: [],
    shape: [],
    today: [],
    trans: [],
    story: [],
    goodbye: []
  }

  // Loop through every day between `date` and `endDate`, incrementing `date` each loop
  while (date < endDate) {

    // Prep data structure
    const day = {
      date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`, // Build our own date string to ensure consistency [2025-4-3]
      epoch: date.getTime(), //// Also store date as Unix epoch just in case
      weekday: date.getDay(),
      color: null,
      song: null,
      exerc: null,
      shape: null,
      today: null,
      trans: null,
      story: null,
      goodbye: null
    };

    // Choose a random index for the source arrays that are always needed
    const colorIndex = chooseIndex(door_colors,    used.color, 30);
    const chantIndex = chooseIndex(alphabet_chant, used.chant, 2);

    // Use those indexes to pull in the actual data for current day (and set the date)
    day.vocab = usagi_vocab[vocabIndex];
    day.chant = alphabet_chant[chantIndex];


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
