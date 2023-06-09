import './TripCalendar.css';
import TripDay from './TripDay.jsx';
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
	isSameMonth,
	addDays,
	subDays,
	isSameDay,
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

	// currDateStart stores the first day of the currently viewing month and year
	const [currDateStart, setCurrDateStart] = useState(startOfMonth(startDate));

	/**
	 * null: date range selection has not started
	 * Date: start Date range for selection { isAM: bool , date: Date }
	 */
	const [isSelectingDate, setIsSelectingDate] = useState(null);
	const [isLeftEnd, setIsLeftEnd] = useState(
		isSameMonth(currDateStart, startDate) ? true : false
	);
	const [isRightEnd, setIsRightEnd] = useState(
		isSameMonth(currDateStart, endDate) ? true : false
	);

	useEffect(() => {
		setIsLeftEnd(isSameMonth(currDateStart, startDate));
		setIsRightEnd(isSameMonth(currDateStart, endDate));
	}, [currDateStart]);

	const handleChangeMonth = isNext => {
		if (isNext && !isRightEnd) {
			setCurrDateStart(addMonths(currDateStart, 1));
		} else if (!isNext && !isLeftEnd) {
			setCurrDateStart(subMonths(currDateStart, 1));
		}
	};

	let tempDate = currDateStart;
	let tempDay = getDay(tempDate);
	console.log(tempDay);
	return (
		<div>
			<div className="calendar-grid">
				<header className="calendar-toolbar">
					<button
						onClick={() => handleChangeMonth(false)}
						style={{ background: 'inherit', border: 'none' }}
						className={isLeftEnd ? 'highlighted' : ''}
					>
						{'<'}
					</button>
					{currDateStart.getFullYear() + ' ' + MONTHS[currDateStart.getMonth()]}
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
					{monthArray.map((weekArr, weekIndex) => {
						return (
							<div className="week-container">
								{weekArr.map((day, dayIndex) => {
									if (
										(weekIndex == 0 && dayIndex < getDay(tempDate)) ||
										!isSameMonth(tempDate, currDateStart)
									) {
										// do not do anything
										// tempDate doesn't update, simply return empty cells
										//return empty day
										return (
											<TripDay
												className="day-container"
												date={''}
												isSelectingDate={isSelectingDate}
												setIsSelectingDate={setIsSelectingDate}
												validDate={false}
											/>
										);
									}
									tempDate = addDays(tempDate, 1);
									return (
										<TripDay
											className="day-container"
											date={subDays(tempDate, 1)}
											isSelectingDate={isSelectingDate}
											setIsSelectingDate={setIsSelectingDate}
											validDate={true}
										/>
									);
								})}
							</div>
						);
					})}
				</main>
			</div>
		</div>
	);
};
export default TripCalendar;
