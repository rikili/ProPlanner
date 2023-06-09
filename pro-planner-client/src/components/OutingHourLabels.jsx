// code references https://date-fns.org/v2.30.0/docs/eachHourOfInterval
// updating array references https://bobbyhadz.com/blog/javascript-modify-all-array-elements
import React from 'react';
import { eachHourOfInterval, getHours } from 'date-fns';
import './OutingHourLabels.scss';

function OutingHourLabels() {
    const hours = eachHourOfInterval({
        start: new Date(2023, 9, 6, 0),
        end: new Date(2023, 9, 6, 24),
    });
    hours.forEach((date, index) => {
        hours[index] = getHours(date);
    });
    hours[hours.length - 1] = 24;
    return (
        <div className="hours-container">
            {hours.map((hour, index) => (
                <p key={index} className="hours">
                    {`${hour}:00`}
                </p>
            ))}
        </div>
    );
}

export default OutingHourLabels;
