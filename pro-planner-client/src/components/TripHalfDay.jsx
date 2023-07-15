import React from 'react';
import { format } from 'date-fns';

const TripHalfDay = ({
	date,
	editable,
	onMouseEnter,
	onClick,
	selections,
	maxUsers,
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
		{isValid && <>
			<div style={{fontSize: '12px'}}>{selections === null ? (isSelected ? 'edit' : 'X') : (selections.length ? 'sel' : 'X')}</div>
			<div style={{fontSize: '12px'}}>{format(date, 'MM-dd')}</div>
			<div style={{fontSize: '12px'}}>{!editable ? `${selections?.length}/${maxUsers}` : ''}</div>
		</>}
	</div>
};

export default TripHalfDay;
