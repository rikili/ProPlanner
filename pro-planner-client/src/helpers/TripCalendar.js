import { set } from 'date-fns';

const FIRST_HALF_HOUR = 6;
const SECOND_HALF_HOUR = 18;

export const getHalfDate = (date, isFirstHalf) =>
    set(new Date(date), {
        hours: isFirstHalf ? FIRST_HALF_HOUR : SECOND_HALF_HOUR,
    });

export const isFirstHalf = (dateHalf) => dateHalf.getHours() === FIRST_HALF_HOUR;
