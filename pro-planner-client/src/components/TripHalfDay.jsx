import React from 'react';
import { getDate, isSameDay, isSameMonth } from 'date-fns';
import { useState } from 'react';

export const TripHalfDay = props => {
	const handleSelection = () => {
		if (props.isSelectingDate) {
			// this is the second click case
			// we need to add the date range to the store from [isSelectingDate, props.date] ~> might need to be flipped
		} else {
			props.setIsSelectingDate(props.date);
		}
	};

	console.log(props.validDate);

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

	//{ isSameDay(props.date, props.IsSelectingDate) && isSameMonth(props.date, props.IsSelectingDate) ? "half-day" : "half-day active" }

	return (
		<div
			className={'half-day' + ' ' + setActive() + ' ' + setHover()}
			onClick={handleSelection}
		>
			{' '}
			{props.date && props.date.getDate()}{' '}
		</div>
	);
};
