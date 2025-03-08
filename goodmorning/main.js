import { door_colors } from './data/door_colors.js';
import { hello_songs } from './data/hello_songs.js';
import { lets_exercise } from './data/lets_exercise.js';
import { window_shapes } from './data/window_shapes.js';
import { todays_lesson } from './data/todays_lesson.js';
import { trans_phonics } from './data/trans_phonics.js';
import { stories } from './data/stories.js';
import { goodbyes } from './data/goodbyes.js';


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


// const timesUsed = [];
// const currentStory = { index: null, part: 1, data: null };
// const usedStories = [];


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
    color: [], // indexes
    song:  [], // indexes
    exerc: [], // 
    shape: [], // indexes
    today: {
      groups: [],
      lessons: Array(todays_lesson.length).fill([])
    },
    // todayCats: Array(todays_lesson.length),
    // todayCats: Array(todays_lesson.length).fill([]),
    trans: [], // indexes
    time:  [], // time strings
    story: [],
    gdbye: []
  }

  let currentStory = null;

  // Story has n episodes: once chosen, must run sequentially until finished
  // const currentStory = { index: null, episode: null }

  // Loop through every day between `date` and `endDate`, incrementing `date` each loop
  while (date < endDate) {

    // Prep data structure
    const day = {
      date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`, // Build our own date string to ensure consistency [2025-4-3]
      epoch: date.getTime(), //// Also store date as Unix epoch just in case
      weekday: date.getDay(),

      color: null,
      song:  null,
      exerc: null, //// [subroutine]
      shape: null,
      today: null, //// [subroutine]
      trans: null,
      time:  null, //// generate random time between 1:00 and 12:55 (5-minute intervals)
      story: null, //// once a story is chosen, loop that story until finished
      gdbye: null
    };


    /**
     * Total of 9 sections:
     * 
     * 6 are a simple array choice:
     * - color
     * - song
     * - exerc (not really a flat array as 5 types, most with 10 versions each)
     * - shape
     * - trans
     * - gdbye
     * 
     * 3 are more complex:
     * - today
     * - time
     * - story
    */

    // Choose a random index for the source arrays that are always needed
    const colorIndex = chooseIndex(door_colors,   used.color, 3); // 7 items
    const songIndex  = chooseIndex(hello_songs,   used.song,  2); // 4 items
    const exercIndex = chooseIndex(lets_exercise, used.exerc, 40); // 45 items
    const shapeIndex = chooseIndex(window_shapes, used.shape, 1); // 4 items
    // const todayIndex = chooseIndex(todays_lesson, used.today, 3); // 8 groups (between 2 and 23 items each)
    const transIndex = chooseIndex(trans_phonics, used.trans, 3); // 5 items
    // const storyIndex = chooseIndex(stories,       used.story, 6);  // 9 items (between 5 and 11 episodes each)
    const gdbyeIndex = chooseIndex(goodbyes,      used.gdbye, 2); // 3 items

    // Use those indexes to pull in the actual data for current day (and set the date)
    day.color = door_colors[colorIndex];
    day.song  = hello_songs[songIndex];
    day.exerc = lets_exercise[exercIndex];
    day.shape = window_shapes[shapeIndex];
    // day.today = todays_lesson[todayIndex];
    day.trans = trans_phonics[transIndex];
    // day.time  = `${randomIntegerInclusive(1,12)}:${String(randomIntegerInclusive(1,11) * 5).padStart(2, '0')}`;
    // day.time  = timeChooseExclude();
    // day.story = chooseStory();
    day.gdbye = goodbyes[gdbyeIndex];


    //// Special case: Today [today]

    // log(used.today);
    const todayGroupIndex = chooseIndex(todays_lesson, used.today.groups, 2);
    const todayGroup = todays_lesson[todayGroupIndex];
    const todayChoices = todayGroup.choices;
    // const todayLessonArray = todays_lesson[todayGroupIndex].choices;
    log(todayGroup);
    // const todayLessonIndex = chooseIndex(todayLessonArray, used.today.lessons[todayGroupIndex], todayLessonArray.length - Math.floor(todayLessonArray.length * 0.3));
    const spliceWhenFull = todayChoices.length < 4 ? 1 : todayChoices.length - Math.floor(todayChoices.length * 0.8);
    // const spliceWhenFull = todayLessonArray.length < 4 ? Math.floor(todayLessonArray.length/2) : todayLessonArray.length - Math.floor(todayLessonArray.length * 0.8);
    // log(todayLessonArray.length, '-', spliceWhenFull, '=', todayLessonArray.length - spliceWhenFull);
    // const todayLessonIndex = chooseIndex(todayLessonArray, used.today.lessons[todayGroupIndex], todayLessonArray.length);
    const todayLessonIndex = chooseIndex(todayChoices, used.today.lessons[todayGroupIndex], spliceWhenFull);
    // log(todayLessonIndex);
    // log(todayLessonArray[todayLessonIndex]);
    // day.today = todayLessonArray[todayLessonIndex];
    day.today = {
      group: todayGroup.group,
      lesson: todayChoices[todayLessonIndex]
    };




    //// Special case: Time [time]

    while (day.time === null) {
      // generate a random time string (5min intervals)
      const randomTime = `${String(randomIntegerInclusive(1,12)).padStart(2, '0')}:${String(randomIntegerInclusive(0,11) * 5).padStart(2, '0')}`;
      // if it's not in the `used` list, accept and exit while loop, otherwise generate another
      if (used.time.indexOf(randomTime) === -1) {
        used.time.push(randomTime);
        if (used.time.length > 10) { used.time.splice(0, 1); } // max 'memory' length is 10 - remove one if we go over this
        day.time = randomTime;
      }
    }

    //// Special case: Story [story]

    if (currentStory === null || currentStory.part == currentStory.data.parts) { // just started (null) or reached the end of current story episodes
      // choose new story (excluding previously used)
      const storyIndex = chooseIndex(stories, used.story, 4);
      currentStory = {
        index: storyIndex,
        part: 1,
        data: stories[storyIndex]
      }
    } else {
      // increment episode
      currentStory.part++;
    }
    day.story = { slug: currentStory.data.slug, part: currentStory.part }


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

/*function timeChooseExclude(rememberHowMany = 10, numberToSpliceWhenFull = 1) {
  let chosen = null;
  while (chosen === null) {
    // const randomTime = `${randomIntegerInclusive(1,12)}:${String(randomIntegerInclusive(1,11) * 5).padStart(2, '0')}`;
    const randomTime = `${String(randomIntegerInclusive(1,12)).padStart(2, '0')}:${String(randomIntegerInclusive(1,11) * 5).padStart(2, '0')}`;
    if (timesUsed.indexOf(randomTime) === -1) chosen = randomTime;
  }
  timesUsed.push(chosen);
  if (timesUsed.length >= rememberHowMany) {
    timesUsed.splice(0, numberToSpliceWhenFull);
  }
  // log(timesUsed);
  return chosen;
}

function chooseStory() {
  // log(currentStory);
  // log(usedStories);

  // if (currentStory.index == null || currentStory.part < currentStory.data.parts) {
  if (currentStory.data == null || currentStory.part == currentStory.data.parts) {
  // if (currentStory.data == null || currentStory.part < currentStory.data.parts) {
    // log(currentStory.part < currentStory.data?.parts);
  // if (currentStory.part < currentStory.data.parts) {
    // log('NEW!');
    // choose new story
    const storyIndex = chooseIndex(stories, usedStories, 4);
    currentStory.index = storyIndex;
    currentStory.part = 1;
    currentStory.data = stories[storyIndex];
  } else {
    // increment episode
    currentStory.part++;
  }
  return { slug: currentStory.data.slug, part: currentStory.part }
}

function newStory() {

}
*/


function chooseIndex(sourceArray, usedArray, numberToSpliceWhenFull) {
  // log(usedArray);
  // log(numberToSpliceWhenFull, sourceArray.length, sourceArray, usedArray.length);

  // If all [sourceArray] items have been previously chosen, remove the oldest [n] from front of [usedArray] with `splice()`
  // const usedMax = usedArray.length - Math.floor(usedArray.length * 0.5);
  // log(sourceArray.length, usedMax);
  // if (usedArray.length == usedMax) {
  if (usedArray.length >= sourceArray.length) {
    usedArray.splice(0, numberToSpliceWhenFull);
  }

  // log('source', sourceArray.length, '/ used', usedArray.length);

  // Choose a random index while excluding those previously chosen
  const chosen = randomIndexExclude(sourceArray, usedArray);

  // Keep track of what's been chosen by storing its index in the given [usedArray]
  usedArray.push(chosen);

  // Return chosen index
  return chosen;
}
/*
/// Testing STRING excludes
const used    = [ 'hi', 'there', 'are', 'you', 'ok'];
const choices = [ 'there', 'you', 'go', 'thinking', 'again'];
// log(choices[randomIndexExclude(choices, used)]);
log(randomStringExclude(choices, used));
*/

/*function randomStringExclude(array, excludeArray) {
  let chosen = null;
  while (chosen === null) {
    const randomIndex = randomIntegerInclusive(0, array.length - 1);
    const candidate = array[randomIndex];
    if (excludeArray.indexOf(candidate) === -1) chosen = candidate;
  }
  return chosen;
}*/

function randomIndexExclude(array, excludeArray) {
  let chosen = null;
  let iterations = 0;
  while (chosen === null) {
    iterations++;
    const candidate = randomIntegerInclusive(0, array.length - 1);
    if (excludeArray.indexOf(candidate) === -1) chosen = candidate;
    if (iterations > 100) { console.warn('max iterations', array); chosen = candidate; }
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
    exercCell.textContent = `${item.exerc.name}`;
    tr.appendChild(exercCell);

    const shapeCell = document.createElement('td');
    shapeCell.classList.add('shape');
    shapeCell.textContent = `${item.shape}`;
    tr.appendChild(shapeCell);

    const todayCell = document.createElement('td');
    todayCell.classList.add('today');
    todayCell.textContent = `[${item.today.group}] ${item.today.lesson}`;
    tr.appendChild(todayCell);

    const transCell = document.createElement('td');
    transCell.classList.add('trans');
    transCell.textContent = `${item.trans}`;
    tr.appendChild(transCell);

    const timeCell = document.createElement('td');
    timeCell.classList.add('time');
    timeCell.textContent = `${item.time}`;
    tr.appendChild(timeCell);

    const storyCell = document.createElement('td');
    storyCell.classList.add('story');
    storyCell.textContent = `${item.story.slug}-${item.story.part}`;
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