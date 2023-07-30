import React from 'react';
import { format, isEqual } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { assembleClass } from '../helpers/Utils';
import './TripCalendar.scss';
import { setDetailedUsers, setDetailedDay } from '../redux/summarySlice';
import { STEP_ARR } from '../helpers/Calendar';

const TripHalfDay = ({
	topHalf,
	date,
	editing,
	deciding,
	isDecisionSelect,
	onMouseEnter,
	onClick,
	selections,
	maxUsers,
	isDecided,
	isSelected,
	isValid,
	isPreviewed,
	className,
}) => {
	const dispatch = useDispatch();
	const detailedDay = useSelector(state => state.summary.detailedDay);
	let isDetailedDay = false;
	if (detailedDay) {
		isDetailedDay = isEqual(new Date(detailedDay), date);
	}

	const handleClick = () => {
		if (editing || deciding) {
			onClick();
			return;
		}
		if (isDetailedDay) {
			dispatch(setDetailedDay(null));
			dispatch(setDetailedUsers([]));
		} else {
			dispatch(setDetailedDay(date.toISOString()));
			dispatch(setDetailedUsers(selections));
		}
	};

    let step;
    if (!editing) {
        const ratio = selections.length / maxUsers;
        step = STEP_ARR.reduce((acc, [lower, upper], index) => {
            if (acc === null) {
                if (ratio >= lower && ratio <= upper) {
                    return index + 1;
                }
            }
            return acc;
        }, null);
    }

	let classState;
	if (editing) {
		classState = assembleClass(
			isPreviewed && 'trip-preview',
			isSelected && 'trip-edit'
		);
	} else {
		classState = assembleClass(
			selections.length && `trip-selected trip-selected-${step}`,
			(isDecided || isDecisionSelect) && `trip-decided-${step}`
		);
	}

	const compiledClass = assembleClass(
		className,
		isValid && classState + ' valid',
		!isValid && 'trip-invalid',
		isDetailedDay && !deciding
			? 'trip-detailed'
			: deciding && isPreviewed && 'trip-decided-preview'
	);

	return (
		<div
			onClick={handleClick}
			onMouseEnter={editing || deciding ? onMouseEnter : null}
			className={compiledClass}
		>
			{topHalf && <div className="trip-half-label">{format(date, 'd')}</div>}
		</div>
	);
};

export default TripHalfDay;
