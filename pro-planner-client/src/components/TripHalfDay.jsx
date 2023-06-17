import React from 'react';
import { format } from 'date-fns';

const TripHalfDay = ({
	date,
	editable,
	onMouseEnter,
	onClick,
	selections,
	isSelected,
	isValid,
	isPreviewed,
	style
}) => {
	return <div
		style={isValid ? (isPreviewed ? {...style, backgroundColor: 'blue'} : style) : {backgroundColor: 'grey', height: '50%'}}
		onClick={editable ? onClick : ()=>{}}
		onMouseEnter={editable ? onMouseEnter : ()=>{}}
	>
		<div>{selections === null ? (isSelected ? 'edit' : 'b') : (selections.length ? 'selected' : 'a')}</div>
		<div>{format(date, 'yyyy-MM-dd')}</div>
	</div>
};

export default TripHalfDay;
