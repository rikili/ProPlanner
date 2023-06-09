import React from 'react';
import { getDate, isSameDay, isSameMonth } from 'date-fns';
import { useState } from 'react';

export const TripHalfDay = props => {
	let x = '';
	const handleSelection = () => {
		if (props.isSelectingDate) {
			// this is the second click case
			// we need to add the date range to the store from [isSelectingDate, props.date] ~> might need to be flipped
		} else {
			props.setIsSelectingDate(props.date);
		}
	};

	const setClassName = () => {
		if (
			isSameDay(props.date, props.isSelectingDate) &&
			isSameMonth(props.date, props.isSelectingDate)
		) {
			return 'active';
		}
	};

	//{ isSameDay(props.date, props.IsSelectingDate) && isSameMonth(props.date, props.IsSelectingDate) ? "half-day" : "half-day active" }

	return (
		<div className={'half-day ' + setClassName()} onClick={handleSelection}>
			{' '}
			{props.date && props.date.getDate()}{' '}
		</div>
	);
};
