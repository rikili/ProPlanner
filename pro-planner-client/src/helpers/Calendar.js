import { addWeeks, addDays, getDay } from "date-fns";

export const STEP_ARR = [[0, 0.25], [0.26, 0.5], [0.51, 0.75], [0.76, 1]];

// translate given date into date indexing format
export const getMonthIndex = (date) => `${date.getMonth()}-${date.getFullYear()}`;

// translate dayOffset array + starting date to an array of the valid days of the week
export const dayOffsetToDOW = (startDate, dayOffset) => {
    let result = [startDate.getDay()];
    let iterDate = new Date(startDate);
    const limitDate = addWeeks(startDate, 1);
    let count = 0;
    
    while (iterDate < limitDate && count < dayOffset.length) {
        iterDate = addDays(iterDate, dayOffset[count]);
        result.push(iterDate.getDay());
        count++;
    }
    return result;
}