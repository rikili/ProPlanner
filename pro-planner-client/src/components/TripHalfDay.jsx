import React from 'react';
import { format, getDate, isSameDay, isSameMonth, isBefore, isAfter, parseISO} from 'date-fns';
import { useState } from 'react';

export const TripHalfDay =  props => {
	let styleVal = {

	};
	

	const handleSelection = () => {
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

	// const setHover = () => { 
	// 	if (props.className === 'valid') {
	// 		return 'valid';
	// 	}
	// 	return '';
	// };

	const isAM = () => {

		if (props.date && props.date.getHours() < 12) {
			const time = format(props.date, 'HH');
			return true;
		}

		return false;
	}

	if (props.isEditMode) {
		// handleSelections
		// props.isSelectingDate
		// 
	}

	// TODO: use the followoing attributes for hover effect
	// onMouseEnter={handleMouseEnter}
	// onMouseLeave={handleMouseLeave}
	return (
		<div 
			className={'half-day' + ' ' +  props.className + " " +  setActive() }
			style={ (props.numSelections && !props.isEditMode) ? {background: `rgba(30, 255, 50, ${props.numSelections * 0.2})`} : {} }
			// on
		>
			{ isAM() && props.date.getDate() }
		</div>
	);
};

export default TripHalfDay;