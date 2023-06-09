import React from 'react';
import { getDate } from 'date-fns/fp'
import { HalfDay } from './HalfDay';

const Day = ( props ) => {

    return (
        <div className="day-container">
            <HalfDay className="half-day" type="AM" { ...props }  />
            <HalfDay className="half-day" type="PM" { ...props }  />
        </div>
    );
}

export default Day;