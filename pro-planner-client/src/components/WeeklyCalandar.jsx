// getting date info referencs https://stackoverflow.com/questions/47607666/how-to-extract-only-time-from-iso-date-format-in-javascript
// adding days to date references https://stackoverflow.com/questions/563406/how-to-add-days-to-date
// code references https://date-fns.org/docs/Getting-Started

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { addWeeks, isWithinInterval, addDays, startOfWeek } from 'date-fns';
import { processDates, getWeekInterval } from '../helpers/Outing';
import Day from './Day';

function WeeklyCalandar() {
  const startTime = new Date('2023-06-03, 01:00:00');
  const endTime = new Date('2023-06-03, 11:00:00');
  const endDate = new Date('2023-06-9, 11:00:00');
  const params = {
    availableDays: [0, 1, 2, 5, 6],
    dateTimeRange: [[startTime, endTime], endDate],
  };
  const [selectWeek, setSelectWeek] = useState(1);

  let dates = processDates(params);

  const calendarDisplay = [];
  let currWeek = [];
  let weekCount = 0;
  for (const availability of dates) {
    currWeek.push(availability);
    weekCount++;
    if (weekCount >= 7) {
      calendarDisplay.push(currWeek);
      currWeek = [];
      weekCount = 0;
    }
  }

  console.log(calendarDisplay);

  return (
    <div className="d-flex w-75 m-auto">
      {calendarDisplay[selectWeek].map((availability) => <Day availability={availability} />)}
    </div>
  );
  // let showDays = dates.map((day) => <Day day={day} />);
  // return <div>{showDays}</div>;
}
export default WeeklyCalandar;
