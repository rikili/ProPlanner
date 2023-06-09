// getting date info referencs https://stackoverflow.com/questions/47607666/how-to-extract-only-time-from-iso-date-format-in-javascript
// adding days to date references https://stackoverflow.com/questions/563406/how-to-add-days-to-date
// code references https://date-fns.org/docs/Getting-Started
// disable button references https://stackoverflow.com/questions/38196743/conditionally-set-the-disabled-state-of-a-bootstrap-button
// conditional className references https://stackoverflow.com/questions/30533171/react-js-conditionally-applying-class-attributes

import React, { useState } from 'react';
import { format } from 'date-fns';
import { processDates } from '../helpers/Outing';
import Day from './Day';
import Hours from './Hours';
import Button from 'react-bootstrap/Button';

function WeeklyCalandar() {
    const startTime = new Date('2023-06-03, 01:00:00');
    const endTime = new Date('2023-06-03, 23:00:00');
    const endDate = new Date('2023-06-21, 23:00:00');
    const params = {
        availableDays: [0, 1, 3, 5, 6],
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

    function changeWeek(type) {
        if (type) {
            setSelectWeek(selectWeek + 1);
        } else {
            setSelectWeek(selectWeek - 1);
        }
    }

    return (
        <div className="d-flex flex-column w-75 m-auto">
            <h3>{format(calendarDisplay[selectWeek][0].startInterval, 'MMMM')}</h3>
            <div className="d-flex">
                <Hours />
                {calendarDisplay[selectWeek].map((availability, index) => (
                    <Day key={`day-${index}`} availability={availability} borderLeft={index === 0} />
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
}
export default WeeklyCalandar;