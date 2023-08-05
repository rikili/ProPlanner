// code references date-fns-tz: https://github.com/marnusw/date-fns-tz
// exporting multiple functions references: https://stackoverflow.com/questions/33589571/module-exports-that-include-all-functions-in-a-single-line
// converting timezone references: https://github.com/marnusw/date-fns-tz
// getting substring by char references: https://stackoverflow.com/questions/9133102/how-to-grab-substring-before-a-specified-character-in-javascript

const tz = require('date-fns-tz');
const date_fns = require('date-fns');

const getOffset = (timezone) => {
  return tz.getTimezoneOffset(timezone) / 3600000;
};

const makeAvailabilityDates = (date, timezone) => {
  let months = Object.keys(date);

  const offset = getOffset(timezone);
  if (offset <= -6) {
    // holds first day of first beginning month
    const isFirstMonthDaySelected = date[months[0]][0][0] === true;
    for (let i = 0; i < months.length; i++) {
      const monthDateSplit = months[i].split('-');
      const daysOfMonth = date_fns.getDaysInMonth(new Date(`${parseInt(monthDateSplit[0]) + 1}-2-${monthDateSplit[1]}`));
      for (let j = 0; j < daysOfMonth - 1; j++) {
        date[months[i]][j][0] = date[months[i]][j][1];
        date[months[i]][j][1] = date[months[i]][j + 1][0];
      }
      date[months[i]][daysOfMonth - 1][0] = date[months[i]][daysOfMonth - 1][1];
      if (months[i + 1]) {
        date[months[i]][daysOfMonth - 1][1] = date[months[i + 1]][0][0];
      } else {
        date[months[i]][daysOfMonth - 1][1] = false;
      }
    }

    // build new prev month
    const prevMonthYear = createDateShift(months[0], 'prev');
    const prevMonth = prevMonthYear[0];
    const year = prevMonthYear[1];
    const prevMonthDate = new Date(`${parseInt(prevMonth) + 1}-2-${year}`);
    date[`${prevMonth}-${year}`] = createMonth(prevMonthDate);
    if (isFirstMonthDaySelected) {
      date[`${prevMonth}-${year}`][date_fns.getDaysInMonth(prevMonthDate) - 1] = [false, true];
    }
  } else if (offset >= 6) {
    let replaceFirstHalfDayValue = date[months[0]][0][1] ? true : false;
    for (let i = 0; i < months.length; i++) {
      const monthDateSplit = months[i].split('-');
      daysOfMonth = date_fns.getDaysInMonth(new Date(`${parseInt(monthDateSplit[0]) + 1}-2-${monthDateSplit[1]}`));
      for (let j = 0; j < daysOfMonth; j++) {
        let replaceSecondHalfDayValue = date[months[i]][j][0] ? true : false;
        date[months[i]][j][0] = replaceFirstHalfDayValue;
        replaceFirstHalfDayValue = date[months[i]][j][1] ? true : false;
        date[months[i]][j][1] = replaceSecondHalfDayValue;
      }
    }
    date[months[0]][0][0] = false;

    const nextMonthYear = createDateShift(months[months.length - 1], 'next');
    const nextMonth = nextMonthYear[0];
    const year = nextMonthYear[1];
    const nextMonthDate = new Date(`${parseInt(nextMonth) + 1}-2-${year}`);
    date[`${nextMonth}-${year}`] = createMonth(nextMonthDate);
    date[`${nextMonth}-${year}`][0] = [replaceFirstHalfDayValue, false];
  }
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

const createDateShift = (date, shiftType) => {
  const splitDate = date.split('-');
  const month = splitDate[0];
  const year = splitDate[1];
  if (shiftType === 'next') {
    return [(parseInt(month) + 1) % 11, parseInt(month) + 1 > 11 ? parseInt(year) + 1 : year];
  } else {
    return [parseInt(month) === 0 ? '11' : month - 1, parseInt(month) === 0 ? parseInt(year) - 1 : year];
  }
};

const convertCalendarLocal = (months, offset) => {
  const finalMonth = [];
  if (offset >= 6) {
    // moved forward --> revert backward
    for (let dayOfMonth = 0; dayOfMonth < months[0].length - 1; dayOfMonth++) {
      finalMonth[dayOfMonth] = [];
      finalMonth[dayOfMonth][0] = months[0][dayOfMonth][1];
      finalMonth[dayOfMonth][1] = months[0][dayOfMonth + 1][0];
    }
    finalMonth[months[0].length - 1] = [];
    finalMonth[months[0].length - 1][0] = months[0][months[0].length - 1][1];
    finalMonth[months[0].length - 1][1] = months[1][0][0];
  } else {
    // moved backward --> revert forward
    finalMonth[0] = [];
    finalMonth[0][0] = months[0][months[0].length - 1][1];
    finalMonth[0][1] = months[1][0][0];
    for (let dayOfMonth = 1; dayOfMonth < months[1].length; dayOfMonth++) {
      finalMonth[dayOfMonth] = [];
      finalMonth[dayOfMonth][0] = months[1][dayOfMonth - 1][1];
      finalMonth[dayOfMonth][1] = months[1][dayOfMonth][0];
    }
  }
  return finalMonth;
};

module.exports = {
  makeAvailabilityDates,
  createMonth,
  getOffset,
  convertCalendarLocal,
  createDateShift,
};
