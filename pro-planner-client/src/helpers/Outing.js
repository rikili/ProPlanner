// code references https://date-fns.org/docs/Getting-Started

import { isAfter, set, getDay, getHours, getMinutes, addDays, getDate, startOfWeek, endOfWeek, startOfDay } from 'date-fns';

export function processDates(params) {
    const startInterval = params.dateTimeRange[0][0];
    const endInterval = params.dateTimeRange[0][1];
    const endDate = params.dateTimeRange[1];

    let nextDayOverFlow = false;
    if (getDate(startInterval) !== getDate(endInterval)) {
        nextDayOverFlow = true;
    }

    let startWeekForInterval = startOfWeek(startInterval);

    let datesIndex = 0;
    let dates = [];
    while (getDay(startInterval) !== getDay(startWeekForInterval)) {
        dates[datesIndex] = {
            isAvailable: false,
            startInterval: startWeekForInterval,
        };
        startWeekForInterval = addDays(startWeekForInterval, 1);
        datesIndex++;
    }

    dates.push({
        isAvailable: true,
        startInterval: startInterval,
        endInterval: endInterval,
    });
    datesIndex++;
    if (nextDayOverFlow) {
        dates[0].endInterval = startInterval(startInterval);
    }
    let currDate = addDays(startInterval, 1);
    let tempStartInterval = startInterval;
    let tempEndInterval = endInterval;

    let dayOfWeekIndex = getDay(startInterval) === 6 ? 0 : getDay(startInterval) + 1;

    let firstDay = true;
    while (!isAfter(currDate, endDate)) {
        dates[datesIndex] = {};
        if (params.availableDays.includes(dayOfWeekIndex)) {
            dates[datesIndex].isAvailable = true;
        } else {
            dates[datesIndex].isAvailable = false;
        }
        dayOfWeekIndex++;
        if (dayOfWeekIndex === 7) {
            dayOfWeekIndex = 0;
        }

        if (dates[datesIndex].isAvailable) {
            if (nextDayOverFlow) {
                if (!firstDay) {
                    let additionalStartInterval = startOfDay(currDate);
                    let additionalEndInterval = set(new Date(), {
                        date: getDate(currDate),
                        hours: getHours(endInterval),
                        minutes: getMinutes(endInterval),
                        seconds: getHours(endInterval),
                        milliseconds: getHours(endInterval),
                    });
                    dates[datesIndex].additionalStart = additionalStartInterval;
                    dates[datesIndex].additionalEnd = additionalEndInterval;
                }
                tempStartInterval = setInterval(tempStartInterval, currDate);
                tempEndInterval = set(new Date(), {
                    date: getDate(currDate),
                    hours: 23,
                    minutes: 59,
                    seconds: 59,
                    milliseconds: 59,
                });
                dates[datesIndex].startInterval = tempStartInterval;
                dates[datesIndex].endInterval = tempEndInterval;
            } else {
                tempStartInterval = setInterval(tempStartInterval, currDate);
                tempEndInterval = setInterval(tempEndInterval, currDate);
                dates[datesIndex].startInterval = tempStartInterval;
                dates[datesIndex].endInterval = tempEndInterval;
            }
        }
        dates[datesIndex].startInterval = currDate;
        currDate = addDays(currDate, 1);
        datesIndex++;
    }

    while (isAfter(endOfWeek(endDate), currDate)) {
        dates.push({ isAvailable: false, startInterval: currDate });
        currDate = addDays(currDate, 1);
    }
    return dates;
}

function setInterval(interval, currDate) {
    return set(interval, {
        date: getDate(currDate),
    });
}

export function getWeekInterval(startOfWeek) {
    return [startOfWeek, set(addDays(startOfWeek, 6), { hours: 23, minutes: 59, seconds: 59, milliseconds: 99 })];
}
