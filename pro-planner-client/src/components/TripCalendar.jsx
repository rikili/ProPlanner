import './TripCalendar.css';
import Day from './Day.jsx';
import { useState, useEffect } from 'react';
import {
	format,
	compareAsc,
	getDay,
	startOfMonth,
	endOfMonth,
	addMonths,
	subMonths,
	getMonth,
	isSameYear,
	isSameMonth
} from 'date-fns';


const MONTHS = {
	0: 'January',
	1: 'February',
	2: 'March',
	3: 'April',
	4: 'May',
	5: 'June',
	6: 'July',
	7: 'August',
	8: 'September',
	9: 'October',
	10: 'November',
	11: 'December',
};

const TripCalendar = () => {
	// temp variables
	const monthArray = [
		[1, 2, 3, 4, 5, 6, 7],
		[5, 6, 7, 8, 9, 10, 11],
		[5, 6, 7, 8, 9, 10, 11],
		[5, 6, 7, 8, 9, 10, 11],
		[5, 6, 7, 8, 9, 10, 11],
		[5, 6, 7, 8, 9, 10, 11],
	];

	//TODO: retreive the values for these from redux based on the user's inputed dateRange.
	const startDate = new Date(2021, 5, 15);
	const endDate = new Date(2022, 6, 20);

	// currDate stores the first day of the currently viewing month and year
	const [currDate, setCurrDate] = useState(startOfMonth(startDate));
/** 
 * null: date range selection has not started
 * Date: start Date range for selection { isAM: bool , date: Date }
 */
	const [isSelectingDate, setIsSelectingDate] = useState(null) 
	const [isLeftEnd, setIsLeftEnd] = useState( isSameMonth(currDate, startDate) ? true : false );
	const [isRightEnd, setIsRightEnd] = useState( isSameMonth(currDate, endDate) ? true : false );
	
	useEffect(() => {
		setIsLeftEnd(isSameMonth(currDate, startDate));
		setIsRightEnd(isSameMonth(currDate, endDate));
	}, [currDate]);
	  
	const handleChangeMonth = isNext => {
		if (isNext && !isRightEnd) {
			setCurrDate(addMonths(currDate, 1));
		} else if (!isNext && !isLeftEnd) {
			setCurrDate(subMonths(currDate, 1));
		} 
	};
	
	
	const tempDate = currDate;
	return (
		<div>
			<div className="calendar-grid">
				<header className="calendar-toolbar">
					<button
						onClick={ () => handleChangeMonth(false) }
						style={{ background: 'inherit', border: 'none' }}
						className={ isLeftEnd ? 'highlighted' : '' }
					>
						{'<'}
					</button>
					{ currDate.getFullYear() + ' ' + MONTHS[currDate.getMonth()]}
					<button
						onClick={() => handleChangeMonth(true)}
						style={{ background: 'inherit', border: 'none' }}
						className={isRightEnd ? 'highlighted' : ''}
					>
						{'>'}
					</button>
				</header>
				<main>
					<ul className="weekday-labels">
						<li>Sun</li>
						<li>Mon</li>
						<li>Tue</li>
						<li>Wed</li>
						<li>Thu</li>
						<li>Fri</li>
						<li>Sat</li>
					</ul>
					{monthArray.map(weekArr => {
						return (
							<div className="week-container">
								{weekArr.map(day => {
									// tempDay = tempDay.getNextDay() ~> pass down as date to Day component
									return <Day className="day-container" date={ startDate } isSelectingDate={ isSelectingDate } setIsSelectingDate={ setIsSelectingDate }/>;
								})}
							</div>
						);
					})}
				</main>
			</div>
		</div>
	);
}			
export default TripCalendar;
