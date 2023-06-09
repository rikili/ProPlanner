// getting date info referencs https://stackoverflow.com/questions/47607666/how-to-extract-only-time-from-iso-date-format-in-javascript
// adding days to date references https://stackoverflow.com/questions/563406/how-to-add-days-to-date
// code references https://date-fns.org/docs/Getting-Started
// disable button references https://stackoverflow.com/questions/38196743/conditionally-set-the-disabled-state-of-a-bootstrap-button
// conditional className references https://stackoverflow.com/questions/30533171/react-js-conditionally-applying-class-attributes

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { addWeeks, isWithinInterval, addDays, startOfWeek } from 'date-fns';
import { processDates, getWeekInterval } from '../helpers/Outing';
import Day from './Day';
import Hours from './Hours';
import Button from 'react-bootstrap/Button';

function WeeklyCalandar() {
  const startTime = new Date('2023-06-03, 01:00:00');
  const endTime = new Date('2023-06-03, 11:00:00');
  const endDate = new Date('2023-06-9, 11:00:00');
  const params = {
    availableDays: [0, 1, 2, 5, 6],
    dateTimeRange: [[startTime, endTime], endDate],
  };
  const [selectWeek, setSelectWeek] = useState(0);

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

  function changeWeek(type) {
    if (type) {
      setSelectWeek(selectWeek + 1);
    } else {
      setSelectWeek(selectWeek - 1);
    }
  }

  return (
    <div className="d-flex flex-column w-75 m-auto">
      <div className="d-flex">
        <Hours />
        {calendarDisplay[selectWeek].map((availability, index) => (
          <Day key={index} availability={availability} />
        ))}
      </div>
      <div className="d-flex justify-content-end">
        <Button onClick={() => changeWeek(false)} className={selectWeek !== 0 ? '' : 'disabled'}>
          Prev
        </Button>
        <Button onClick={() => changeWeek(true)} className={'next-btn ' + (calendarDisplay.length - 1 > selectWeek ? '' : 'disabled')}>
          Next
        </Button>
      </div>
    </div>
  );
  // let showDays = dates.map((day) => <Day day={day} />);
  // return <div>{showDays}</div>;
}
export default WeeklyCalandar;
