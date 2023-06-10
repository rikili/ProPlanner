import React from 'react';
import { getDate, isSameDay, isSameMonth, isBefore, isAfter } from 'date-fns';
import { useState } from 'react';

export const TripHalfDay = props => {
	const handleSelection = () => {
		//
		if (props.isSelectingDate) {
			// TODO: take care of logic of double selecting the same date aka isSelectingDate == props.date
			// this is the second click case
			// we need to add the date range to the store from [isSelectingDate, props.date] ~> might need to be flipped
			// props.date
			// [ [s1, e1] , ... ]
			// clicking isSameDate(isSelectingDate, props.date)
			if (isBefore(props.isSelectingDate, props.date)) {
				props.setDateSelections([
					...props.dateSelections,
					[props.isSelectingDate, props.date],
				]);
			} else {
				props.setDateSelections([
					...props.dateSelections,
					[props.date, props.isSelectingDate],
				]);
			}
		} else {
			props.setIsSelectingDate(props.date);
		}
	};

	const setActive = () => {
		if (
			isSameDay(props.date, props.isSelectingDate) &&
			isSameMonth(props.date, props.isSelectingDate)
		) {
			return 'active';
		}
	};

	const setHover = () => {
		if (props.validDate) {
			return 'valid-date';
		}
	};

	// TODO: use the followoing attributes for hover effect
	// onMouseEnter={handleMouseEnter}
	// onMouseLeave={handleMouseLeave}
	return (
		<div className={'half-day' + ' ' + setActive() + ' ' + setHover()}>
			{props.type == 'AM' && props.date && props.date.getDate()}{' '}
		</div>
	);
};
