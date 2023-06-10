import React from 'react';
import { getDate } from 'date-fns/fp';
import { TripHalfDay } from './TripHalfDay';

const TripDay = props => {
	return (
		<div className="day-container">
			<TripHalfDay className="half-day" type="AM" {...props} />
			<TripHalfDay className="half-day" type="PM" {...props} />
		</div>
	);
};

export default TripDay;
