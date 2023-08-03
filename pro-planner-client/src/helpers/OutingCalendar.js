// code references https://date-fns.org/docs/Getting-Started

import {
    isAfter,
    format,
    addMinutes,
    addDays,
    startOfDay,
    endOfDay,
    parseISO,
    isSameDay,
    subMinutes,
    set,
    subWeeks,
} from 'date-fns';
import { getMonthIndex } from './Calendar';

export const SEGMENT_TIME = 30;

export const isLooseEndOfDay = (date) => date.getHours() === 23 && date.getMinutes() === 59;

// get dateTime of the end of a segment, unless it is the last segment of the day
export const getEndOfSegment = (date) => {
    return (isLooseEndOfDay(date)) ? endOfDay(date) : addMinutes(date, SEGMENT_TIME); // 23:30 is hard-coded, look for alternatives
}
export const getTime = (date) => format(date, "HH:mm");
const processTime = (timeString) => {
    const results = timeString.match(/[0-9]+/g);
    return {hours: results[0], minutes: results[1]}
};

// turn selectInterval (eg. ["00:00", "01:00"]) to a date-fns interval
export const selectToInterval = (date, [start, end]) => {
    let endDate = buildDate(date, end);
    endDate = (end === '23:59') ? endDate : subMinutes(endDate, 1);
    return {start: buildDate(date, start), end: endDate};
}

const buildDate = (date, time) => set(new Date(date), processTime(time));

export const isTimeBefore = (firstTime, secTime, checkEqual = false) => {
        return checkEqual 
            ? buildDate(new Date(), firstTime) <= buildDate(new Date(), secTime)
            : buildDate(new Date(), firstTime) < buildDate(new Date(), secTime);
}

const getDayFromTemplate = (date, template, cutoff = null) => {
    if (!cutoff) cutoff = endOfDay(date);
    const dayArr = [];
    let buildArr = [];

    const start = buildDate(date, template[0]);
    if (isAfter(start, cutoff)) return [];
    buildArr.push(start);

    const firstEnd = buildDate(date, template[1]);
    if (isAfter(firstEnd, cutoff)) {
        buildArr.push(cutoff);
        dayArr.push(buildArr);
        return dayArr;
    }
    buildArr.push(firstEnd);
    dayArr.push(buildArr);

    // Early return for full day or non-overlapping days
    if (!template[2]) {
        return dayArr;
    }
    buildArr = [];

    const secStart = buildDate(date, template[2]);
    if (isAfter(secStart, cutoff)) {
        return dayArr;
    }
    buildArr.push(secStart);

    const secEnd = buildDate(date, template[3]);
    if (isAfter(secEnd, cutoff)) {
        buildArr.push(cutoff);
        dayArr.push(buildArr);
        return dayArr;
    }

    buildArr.push(secEnd);
    dayArr.push(buildArr);
    return dayArr;
}

export function generateSlots(params) {

    let startInterval;
    let endInterval;
    let endDate;

    if (params.isAllDay) {
        startInterval = parseISO(params.dateTimeRange[0]);
        endInterval = endOfDay(startInterval);
        endDate = parseISO(params.dateTimeRange[1]);
    } else {
        startInterval = parseISO(params.dateTimeRange[0][0]);
        endInterval = parseISO(params.dateTimeRange[0][1]);
        endDate = parseISO(params.dateTimeRange[1]);
    }

    let isOverflow = false;
    let firstDay = [];
    let secOverlapDay = [];

    firstDay = [getTime(startInterval),  getTime(new Date(endInterval))];
    if (!isSameDay(startInterval, endInterval)) {
        isOverflow = true;
        firstDay = [getTime(startInterval), getTime(endOfDay(startInterval))];
        secOverlapDay = [
            getTime(startOfDay(endInterval)),
            getTime(endInterval),
            getTime(startInterval),
            getTime(endOfDay(endInterval)),
        ];
    }

    const months = {};
    let monthTrack = {};
    let iterDate = new Date(startInterval);
    let currMonth = iterDate.getMonth();
    let weekdayIndex = 0;
    let isPrevAvailable = false;
    while(iterDate < endDate) {
        if (isPrevAvailable && isOverflow) {
            monthTrack[iterDate.getDate()] = (getDayFromTemplate(iterDate, secOverlapDay, endDate));
        } else {
            monthTrack[iterDate.getDate()] = (getDayFromTemplate(iterDate, firstDay, endDate));
        }

        const dayAdd = params.dayOffset[weekdayIndex];
        iterDate = addDays(iterDate, dayAdd);
        isPrevAvailable = dayAdd === 1;
        weekdayIndex++;
        if (weekdayIndex >= params.dayOffset.length) weekdayIndex = 0;
        if (currMonth !== iterDate.getMonth()) {
            months[getMonthIndex(subWeeks(iterDate, 1))] = monthTrack;
            monthTrack = {};
            currMonth = iterDate.getMonth();
        }
    }

    months[getMonthIndex(iterDate)] = monthTrack;

    // Catch overflow on last day case
    if (isPrevAvailable && isOverflow) {
        monthTrack[iterDate.getDate()] = (getDayFromTemplate(iterDate, secOverlapDay, endDate));
    }

    return months;
}

export function getWeekInterval(startOfWeek) {
    return [startOfWeek, endOfDay(addDays(startOfWeek, 6))];
}
