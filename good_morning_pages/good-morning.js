
const log = console.log;



const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames   = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// const d = new Date();
const d = new Date('2025-6-3');
const today = {
  year:      d.getFullYear(),
  month:     d.getMonth(),
  monthname: monthNames[d.getMonth()],
  daynum:    d.getDate(),
  dayname:   weekdayNames[d.getDay()]
};
const todayStr = `${today.year}-${today.month+1}-${today.daynum}`;

// log(todayStr, today);



const weekday = document.querySelector('#weekday');
// log(weekday);

weekday.textContent = today.dayname;


// Replacement for outdated <body onunload="closeDisplay(); closeResources();">
window.addEventListener('unload', () => {
  closeDisplay();
  closeResources();
});

// Load full schedule JSON file
async function getData(filePath) {
  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    log('todayStr', todayStr)

    const dayData = await json.find( item => item.date == todayStr );
    console.log(json);
    console.log(dayData);
    buildPage(dayData);

  } catch (error) {
    console.error(error.message);
  }
}

getData('data/schedule-v1.json');


function buildPage(data) {
  // log(data);

  const doorElm = document.querySelector('#door-image');
  doorElm.src = `../../media/liveKids/goodMorning/assets/house/${data.color}/house.jpg`
  // doorElm.onclick = `playVideo('goodMorning/assets/house/${data.color}/house.mp4')`
  doorElm.onclick = playVideo(`goodMorning/assets/house/${data.color}/house.mp4`);


}