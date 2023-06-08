// getting date info referencs https://stackoverflow.com/questions/47607666/how-to-extract-only-time-from-iso-date-format-in-javascript
// adding days to date references https://stackoverflow.com/questions/563406/how-to-add-days-to-date
// code references https://date-fns.org/docs/Getting-Started

import React from 'react';
import { useSelector } from 'react-redux';
import { addWeeks, isWithinInterval, addDays, startOfWeek } from 'date-fns';
import { processDates, getWeekInterval } from '../helpers/Outing';
import Day from './Day';

function WeeklyCalandar() {
  const startTime = new Date('2023-06-03, 01:00:00');
  const endTime = new Date('2023-06-03, 03:00:00');
  const endDate = new Date('2023-06-9, 03:00:00');
  const params = {
    availableDays: [0, 1, 2, 5, 6],
    dateTimeRange: [[startTime, endTime], endDate],
  };
  let dates = processDates(params);
  console.log(dates);

  const weekStart = startOfWeek(startTime);
  let currWeekInterval = getWeekInterval(weekStart);

  const calendarDisplay = [];
  let currWeek = [];

  for (const date of dates) {
    if (isWithinInterval(date.startInterval, { start: currWeekInterval[0], end: currWeekInterval[1] })) {
      currWeek.push(date);
    } else {
      calendarDisplay.push(currWeek);
      currWeekInterval = [addDays(currWeekInterval[0], 8), addDays(currWeekInterval[1], 8)];
      currWeek = [];
    }
  }

  return (
    <div>
      {calendarDisplay.map((week) => (
        <div>
          {week.map((date) => (
            <Day day={date} />
          ))}
        </div>
      ))}
    </div>
  );
  // let showDays = dates.map((day) => <Day day={day} />);
  // return <div>{showDays}</div>;
}
export default WeeklyCalandar;
