// descructuring references https://www.w3schools.com/react/react_es6_destructuring.asp
import React from 'react';
import { addMinutes, format, isAfter, isWithinInterval, startOfDay, endOfDay, getDate } from 'date-fns';

import './Day.css';

const segmentInterval = 30; // should be some interval of 15 minutes

const isSegmentAvailable = (time, interval, additionalInterval) => {
  let result = isWithinInterval(time, { start: interval[0], end: addMinutes(interval[1], -1) });
  if (additionalInterval[0] && !result) {
    result = isWithinInterval(time, { start: additionalInterval[0], end: additionalInterval[0] });
  }
  return result;
};

function Day({ availability }) {
  const segmentTotal = 60;

  const { startInterval, endInterval, additionalStart, additionalEnd, isAvailable } = availability;
  let dayDisplay = [];
  let hourDisplay = [];
  let segmentTracker = segmentTotal;
  let timeTracker = startOfDay(startInterval);
  const endOfCurrDay = endOfDay(startInterval);

  while (isAfter(endOfCurrDay, timeTracker)) {
    const isSelectable = isAvailable ? isSegmentAvailable(timeTracker, [startInterval, endInterval], [additionalStart, additionalEnd]) : false;
    hourDisplay.push(
      <div
        key={`${format(timeTracker, 'hh-mm')}`}
        className={`${segmentTracker % segmentTotal ? 'segment' : 'sub-segment'} ${isSelectable ? 'selected' : ''}`}
      />
    );

    timeTracker = addMinutes(timeTracker, segmentInterval);
    segmentTracker -= segmentInterval;
    if (segmentTracker <= 0) {
      dayDisplay.push(
        <div key={`hr-${timeTracker.getHours()}-${timeTracker.getMinutes()}`} className="hour-container">
          {hourDisplay}
        </div>
      );
      hourDisplay = [];
      segmentTracker = segmentTotal;
    }
  }

  return (
    <div className="w-100 position-relative text-center">
      {getDate(startInterval)}
      {dayDisplay}
    </div>
  );
}

export default Day;
