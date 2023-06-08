// descructuring references https://www.w3schools.com/react/react_es6_destructuring.asp
import React from 'react';
import { addMinutes, set, isAfter, isWithinInterval } from 'date-fns';

const segmentInterval = 30; // should be some interval of 15 minutes

const isSegmentAvailable = (time, interval, additionalInterval) => {
  let result = isWithinInterval(time, { start: interval[0], end: interval[1] });
  if (additionalInterval[0] && !result) {
    result = isWithinInterval(time, { start: additionalInterval[0], end: additionalInterval[0] });
  }
  return result;
};

function Day({ startInterval, endInterval, additionalStart, additionalEnd, isAvailable }) {
  const segmentTotal = 60;
  let segmentTracker = segmentTotal;
  let timeTracker = set(startInterval, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  const endOfDay = set(startInterval, { hours: 23, minutes: 59, seconds: 59 });
  let dayDisplay = [];
  let hourDisplay = [];
  while (isAfter(endOfDay, timeTracker)) {
    console.log('asdf');
    const isInAvailable = isAvailable ? isSegmentAvailable(timeTracker, [startInterval, endInterval], [additionalStart, additionalEnd]) : false;
    hourDisplay.push(<div style={{ backgroundColor: isInAvailable ? 'red' : 'transparent' }}>{`hour-${timeTracker.getHours()}`}</div>);

    timeTracker = addMinutes(timeTracker, segmentInterval);
    segmentTracker -= segmentInterval;
    if (segmentTracker <= 0) {
      dayDisplay.push(hourDisplay);
      hourDisplay = [];
    }
  }
  return (
    <div>
      {dayDisplay.map((hour) => (
        <div>{hour}</div>
      ))}
    </div>
  );
}

export default Day;
