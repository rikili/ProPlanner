import React from 'react';
import {
	format,
	getDate,
	isSameDay,
	isSameMonth,
	isBefore,
	isAfter,
	parseISO,
	eachDayOfInterval,
} from 'date-fns';
import { useState } from 'react';
import { useEffect } from 'react';

export const TripHalfDay = props => {
	const styleVal = {
		backgroundColor: '',
	};
	if (props.numSelections && !props.isEditMode) {
		styleVal.backgroundColor = `rgba(30, 255, 50, ${
			props.numSelections * 0.2
		})`;
	}

	// 		? { background: `rgba(30, 255, 50, ${props.numSelections * 0.2})` }
	// 		: {}
	// const getStyle = () => {};
	const handleSelection = () => {
		//second click. the first date has been selected
		if (props.isSelectingDate) {
			//deselect case
			if (
				isSameDay(props.isSelectingDate, props.date)
				 &&
				isSameMonth(props.isSelectingDate, props.date)
			) {
				props.setIsSelectingDate(null);
			}

			// selecting date after isSelectingDate -> create a new range
			if (isAfter(props.date, props.isSelectingDate)) {
				props.setDateSelections([
					...props.dateSelections,
					[props.isSelectingDate, props.date], 
				]);
			} 
			//first click: set the first date of the range!
		} else {
			props.setIsSelectingDate(props.date);
		}
	};

	// when you leave edit mode, the selections are cleared.
	useEffect(() => {
		props.setDateSelections([]);
		props.setIsSelectingDate(null);
	}, [props.isEditMode]);

	const isDateSelected = date => {
		let daysInRange = [];

		if (props.dateSelections) {
			props.dateSelections.forEach(range => {
				const selectedDates = eachDayOfInterval({
					start: range[0],
					end: range[1],
				});
				daysInRange.push(...selectedDates);
			});
		}

		return daysInRange.some(
			selectedDate =>
				isSameDay(selectedDate, date) && isSameMonth(selectedDate, date)
		);
	};

	/* conditions
	 * must be in edit mode
	 * we want to setActive all the dates in props.dateSelections
	 */
	const setActive = () => {
		if (
			props.isEditMode &&
			(isDateSelected(props.date) ||
				(props.isSelectingDate &&
					isSameDay(props.isSelectingDate, props.date) &&
					isSameMonth(props.isSelectingDate, props.date))) &&
			props.className == 'valid'
		) {
			return 'active';
		} else {
			return '';
		}
	};

	const isAM = () => {
		if (props.date && props.date.getHours() < 12) {
			const time = format(props.date, 'HH');
			return true;
		}

		return false;
	};

	// TODO: use the followoing attributes for hover effect
	// onMouseEnter={handleMouseEnter}
	// onMouseLeave={handleMouseLeave}
	return (
		<div
			className={'half-day' + ' ' + props.className + ' ' + setActive()}
			style={styleVal}
			onClick={props.isEditMode ? handleSelection : null}
		>
			{isAM() && props.date.getDate()}
		</div>
	);
};

export default TripHalfDay;
