// code references https://date-fns.org/v2.30.0/docs/eachHourOfInterval
// updating array references https://bobbyhadz.com/blog/javascript-modify-all-array-elements
import React from 'react';
import { eachHourOfInterval, startOfDay, endOfDay, format } from 'date-fns';
import './OutingHourLabels.scss';

function OutingHourLabels() {
    const hours = eachHourOfInterval({
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
    });
    return (
        <div className="hours-container">
            {hours.map((hour, index) => (
                <p key={`hour-label-${index}`} className="hours">
                    {format(hour, 'h aa')}
                </p>
            ))}
        </div>
    );
}

export default OutingHourLabels;
