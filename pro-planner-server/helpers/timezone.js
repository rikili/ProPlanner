// exporting multiple functions references: https://stackoverflow.com/questions/33589571/module-exports-that-include-all-functions-in-a-single-line
// converting timezone references: https://www.npmjs.com/package/date-fns-tz
// getting substring by char references: https://stackoverflow.com/questions/9133102/how-to-grab-substring-before-a-specified-character-in-javascript
// copying array references: https://stackoverflow.com/questions/7486085/copy-array-by-value

const tz = require('date-fns-tz');
const date_fns = require('date-fns');

const firstHalf = '12am-12pm';
const secondHalf = '12pm-11:00pm';

const makeUTCDate = (month, day, year, hours, mins) => {
  const resultDate = new Date();
  resultDate.setUTCMonth(month);
  resultDate.setUTCDate(day);
  resultDate.setUTCFullYear(year);
  resultDate.setUTCHours(hours);
  resultDate.setUTCMinutes(mins);
  resultDate.setUTCSeconds(0);
  resultDate.setUTCMilliseconds(0);
  return resultDate;
};

const templateDate = tz.format(new Date('7-1-2023 06:00:00'), 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'America/Juneau' });
const utcPrevCutoff = makeUTCDate(6, 1, 2023, 0, 0);
const utcNextCutoff = makeUTCDate(6, 1, 2023, 12, 0);

const makeAvailabilityDates = (date) => {
  // let months = Object.keys(date);

  // const utcStartDay = tz.zonedTimeToUtc(templateDate, timezone);
  // console.log(utcStartDay);
  // const moveSlotBack = date_fns.isAfter(utcPrevCutoff, utcStartDay);
  // const moveSlotForward = date_fns.isAfter(utcStartDay, utcNextCutoff);

  // if (moveSlotBack) {
  //   // holds first day of first beginning month
  //   const firstMonthDaySlot = date[months[0]][0].splice();

  //   for (let i = 0; i < months.length - 1; i++) {
  //     daysOfMonth = date_fns.getDaysInMonth(new Date(`${months[i][0]}-2-2023`));
  //     for (let j = 0; j < daysOfMonth - 1; j++) {
  //       date[months[i]][j][0] = date[months[i]][j][1];
  //       date[months[i]][j][1] = date[months[i]][j + 1][0];
  //     }
  //     date[months[i]][daysOfMonth - 1][0] = date[months[i]][daysOfMonth - 1][1];
  //     if (months[i + 1]) {
  //       date[months[i]][daysOfMonth - 1][1] = date[months[i + 1]][0][0] ? date[months[i + 1]][0][0] : false;
  //     } else {
  //       date[months[i]][daysOfMonth - 1][1] = false;
  //     }
  //   }

  //   // build new prev month
  //   const prevMonth = months[0].split('-')[0] - 1;
  //   const currYear = months[0].split('-')[1];
  //   const prevMonthDate = new Date(`${prevMonth}-2-${currYear}`);
  //   date[`${prevMonth}-${currYear}`] = createMonth(prevMonthDate);
  //   if (firstMonthDaySlot[0] === true) {
  //     date[`${prevMonth}-${currYear}`][date_fns.getDaysInMonth(prevMonthDate) - 1] = [false, true];
  //   }
  // } else if (moveSlotForward) {
  //   // check very first one?
  //   for (let i = 0; i < months.length - 1; i++) {
  //     daysOfMonth = date_fns.getDaysInMonth(new Date(`${parseInt(months[0].split('-')[0]) + 1}-2-${months[0].split('-')[1]}`));
  //     for (let j = 1; j < daysOfMonth; j++) {
  //       date[months[i]][j][0] = date[months[i]][j - 1][1];
  //       date[months[i]][j][1] = date[months[i]][j][0];
  //     }
  //     date[months[i]][daysOfMonth - 1][0] = date[months[i]][daysOfMonth - 1][1];
  //   }

  //   const nextMonth = months[months.length - 1].split('-')[0] + 1;
  //   const currYear = months[months.length - 1].split('-')[1];
  //   const nextMonthDate = new Date(`${nextMonth}-2-${currYear}`);
  //   date[`${nextMonth}-${currYear}`] = createMonth(nextMonthDate);
  //   date[`${nextMonth}-${currYear}`][0] = [true, false];
  // }
  return date;
};

const createMonth = (date) => {
  const monthDays = date_fns.getDaysInMonth(date);
  let month = [];
  for (let day = 0; day < monthDays; day++) {
    month.push([false, false]);
  }
  return month;
};

module.exports = {
  makeAvailabilityDates,
  createMonth,
};
