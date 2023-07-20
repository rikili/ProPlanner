import React from 'react';
import { format, isEqual } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { assembleClass } from '../helpers/Utils';
import './TripCalendar.scss';
import { setDetailedUsers, setDetailedDay } from '../redux/tripSlice';

const stepArr = [[0, 0.25], [0.26, 0.5], [0.51, 0.75], [0.76, 1]];

const TripHalfDay = ({
    topHalf,
    date,
    editable,
    onMouseEnter,
    onClick,
    selections,
    maxUsers,
    isSelected,
    isValid,
    isPreviewed,
    className,
}) => {
    const dispatch = useDispatch();
    const detailedDay = useSelector(state => state.tripSelections.detailedDay);
    let isDetailedDay = false;
    if (detailedDay) {
        isDetailedDay = isEqual(new Date(detailedDay.date), date) && (detailedDay.topHalf === topHalf);
    }

    const handleClick = () => {
        if (editable) {
            onClick();
        } else {
            if (isDetailedDay) {
                dispatch(setDetailedDay(null));
                dispatch(setDetailedUsers([]));
            } else {
                dispatch(setDetailedDay({date: date.toISOString(), topHalf}));
                dispatch(setDetailedUsers(selections));
            }
        }
    }

    let step;
    if (!editable) {
        const ratio = selections.length / maxUsers;
        step = stepArr.reduce((acc, [lower, upper], index) => {
            if (acc === null) {
                if (ratio >= lower && ratio <= upper) {
                    return index + 1;
                }
            }
            return acc;
        }, null);
    }

    let classState;
    if (editable) {
        classState = assembleClass(isPreviewed && 'trip-preview', isSelected && 'trip-edit');
    } else {
        classState = selections.length ? `trip-selected trip-selected-${step}` : '';
    }

    const compiledClass = assembleClass(
        className,
        isValid && classState + ' valid',
        !isValid && 'trip-invalid',
        isDetailedDay && 'trip-detailed'
        );

    return (
        <div
            onClick={handleClick}
            onMouseEnter={editable ? onMouseEnter : null}
            className={compiledClass}
        >
            {topHalf && <div className='trip-half-label'>{format(date, 'd')}</div>}
        </div>
    );
};

export default TripHalfDay;
