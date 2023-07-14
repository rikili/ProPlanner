import React from 'react';
import { format } from 'date-fns';
import { assembleClass } from '../helpers/Utils';
import './TripCalendar.scss';

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
    style,
}) => {
    let classState;
    if (editable) {
        classState = assembleClass(
			isPreviewed && 'trip-preview',
			isSelected && 'trip-edit-selected'
		);
    } else {
        classState = selections.length
            ? 'trip-prev-selected'
            : '';
    }

    const compiledClass = assembleClass(
        className,
        isValid && classState + ' valid',
        !isValid && 'trip-invalid'
    );

    return (
        <div onClick={editable ? onClick : () => {}}
             onMouseEnter={editable ? onMouseEnter : () => {}}
             className={compiledClass}
        >
            {topHalf && <div className="ms-1">{format(date, 'd')}</div>}
        </div>
    );
};

export default TripHalfDay;
