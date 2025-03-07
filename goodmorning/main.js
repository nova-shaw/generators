import { door_colors } from './data/door_colors.js'; // 7 items
import { hello_songs } from './data/hello_songs.js'; // 4 items
import { lets_exercise } from './data/lets_exercise.js'; // 5 items
import { window_shapes } from './data/window_shapes.js'; // 4 items
import { todays_lesson } from './data/todays_lesson.js'; // 7 categories (between 2 and 23 items each)
import { trans_phonics } from './data/trans_phonics.js'; // 5 items
// Clock thing - What time is it?
import { stories } from './data/stories.js'; // 9 series (between 5 and 11 episodes each)
import { goodbyes } from './data/goodbyes.js'; // 3 items


const log = console.log;
/*
log('door_colors', door_colors); // color
log('hello_songs', hello_songs); // song
log('lets_exercise', lets_exercise); // exerc
log('window_shapes', window_shapes); // shape
log('todays_lesson', todays_lesson); // today
log('trans_phonics', trans_phonics); // trans
log('stories', stories); // story
log('goodbyes', goodbyes); // goodbye
*/

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
    song:  [],
    exerc: [],
    shape: [],
    today: [],
    trans: [],
    story: [],
    gdbye: []
  }

  // Loop through every day between `date` and `endDate`, incrementing `date` each loop
  while (date < endDate) {

    // Prep data structure
    const day = {
      date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`, // Build our own date string to ensure consistency [2025-4-3]
      epoch: date.getTime(), //// Also store date as Unix epoch just in case
      weekday: date.getDay(),
      color: null,
      song:  null,
      exerc: null, //// subroutine
      shape: null,
      today: null, //// subroutine
      trans: null,
      story: null, //// subroutine
      gdbye: null
    };

    // Choose a random index for the source arrays that are always needed
    const colorIndex = chooseIndex(door_colors,   used.color, 3);
    const songIndex  = chooseIndex(hello_songs,   used.song,  2);
    const exercIndex = chooseIndex(lets_exercise, used.exerc, 2);
    const shapeIndex = chooseIndex(window_shapes, used.shape, 2);
    const todayIndex = chooseIndex(todays_lesson, used.today, 3);
    const transIndex = chooseIndex(trans_phonics, used.trans, 3);
    const storyIndex = chooseIndex(stories,       used.story, 6);
    const gdbyeIndex = chooseIndex(goodbyes,      used.gdbye, 2);

    // Use those indexes to pull in the actual data for current day (and set the date)
    day.color = door_colors[colorIndex];
    day.song  = hello_songs[songIndex];
    day.exerc = lets_exercise[exercIndex];
    day.shape = window_shapes[shapeIndex];
    day.today = todays_lesson[todayIndex];
    day.trans = trans_phonics[transIndex];
    day.story = stories[storyIndex];
    day.gdbye = goodbyes[gdbyeIndex];


    // Add current day to end of the schedule array
    schedule.push(day);

    // Increment date
    date.setDate(date.getDate() + 1);
  }

  // When done, send to output function
  outputSchedule(schedule);

  log(schedule);
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
  const countColor = document.querySelector('#count-color');
  const countHello = document.querySelector('#count-hello');
  const countExerc = document.querySelector('#count-exerc');
  const countShape = document.querySelector('#count-shape');
  const countToday = document.querySelector('#count-today');
  const countTrans = document.querySelector('#count-trans');
  const countStory = document.querySelector('#count-story');
  const countGdbye = document.querySelector('#count-gdbye');
  countColor.textContent = door_colors.length;
  countHello.textContent = hello_songs.length;
  countExerc.textContent = lets_exercise.length;
  countShape.textContent = window_shapes.length;
  countToday.textContent = todays_lesson.length;
  countTrans.textContent = trans_phonics.length;
  countStory.textContent = stories.length;
  countGdbye.textContent = goodbyes.length;


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


    const colorCell = document.createElement('td');
    colorCell.classList.add('color');
    colorCell.textContent = `${item.color}`;
    tr.appendChild(colorCell);

    const songCell = document.createElement('td');
    songCell.classList.add('song');
    songCell.textContent = `${item.song}`;
    tr.appendChild(songCell);

    const exercCell = document.createElement('td');
    exercCell.classList.add('exerc');
    exercCell.textContent = `${item.exerc.file}`;
    tr.appendChild(exercCell);

    const shapeCell = document.createElement('td');
    shapeCell.classList.add('shape');
    shapeCell.textContent = `${item.shape}`;
    tr.appendChild(shapeCell);

    const todayCell = document.createElement('td');
    todayCell.classList.add('today');
    todayCell.textContent = `${item.today.title}`;
    tr.appendChild(todayCell);

    const transCell = document.createElement('td');
    transCell.classList.add('trans');
    transCell.textContent = `${item.trans}`;
    tr.appendChild(transCell);

    const storyCell = document.createElement('td');
    storyCell.classList.add('story');
    storyCell.textContent = `${item.story.title}`;
    tr.appendChild(storyCell);

    const gdbyeCell = document.createElement('td');
    gdbyeCell.classList.add('gdbye');
    gdbyeCell.textContent = `${item.gdbye}`;
    tr.appendChild(gdbyeCell);

    tbody.appendChild(tr);
  });
  
  // Once new tbody is built, replace the existing tbody with it
  const tbodyExisting = document.querySelector('#schedule-table tbody');
  tbodyExisting.replaceWith(tbody);
}