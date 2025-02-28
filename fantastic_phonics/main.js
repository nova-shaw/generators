
const log = console.log;


//// Settings

const startYearMonth = { year: 2025, month: 'april' }; //// month must be full name, not number, capitalisation is ignored
const durationMonths = 12;


//// Internals

// const date = Temporal.PlainDate.from(`${start.year} ${start.month} 1`);
// const date = Temporal.PlainDate.from('2024-12-27');
// log(date);

// const startDate = new Date( `${start.year} ${start.month} 1`);
const date = new Date('2024-12-27 00:00');
const days = 30;
// const startParsed = { y: startDate.getFullYear(), m: startDate.getMonth(), d: startDate.getDate()  };
// log(startDate);
// log(startParsed);

/*for (var i = 0; i < days; i++) {
  // const month = startParsed.getMonth() + 0;
  // log(startDate.getFullYear())
  date.setDate(date.getDate() + 1);
  log('--', date);
}
*/
let daysDone = 0;

while (daysDone < days) {
  log(daysDone + 1, date);
  date.setDate(date.getDate() + 1);
  daysDone += 1;
}