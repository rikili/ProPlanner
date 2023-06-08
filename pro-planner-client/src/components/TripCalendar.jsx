import './TripCalendar.css';
import Cell from './Cell.js';
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
} from 'date-fns';
import { BsFillCaretRightFill, BsFillCaretLeftFill } from 'react-icons/bs';

// const formMonthMap = (inputDate) => {
//     const firstDay = new Date(inputDate);
//     firstDay.setDate(1);

//     const firstOfCalendar = firstDay.getDay() ? previousSunday(firstDay) : firstDay;
//     const lastDayOfCalendar = add(firstOfCalendar, { days: 6, weeks: 6 });

//     const monthArr = [];
//     let startDate = firstOfCalendar;
//     let endDate = addDays(startDate, 6);
//     while (!isSameDay(endDate, lastDayOfCalendar)) {
//         startDate = addDays(startDate, 7);
//         endDate = addDays(endDate, 7);
//     }
//     return monthArr;
// }
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

	const [startDayOfMonth, setStartDayOfMonth] = useState(
		startOfMonth(startDate)
	);
	const [disableButton, setDisableButton] = useState();

	// Handle pressing next/previous month.
	// Once you go next and reach the endDate, you cant go further.
	// Once you go back and reach the startDate, you cant go further.
	const handleChangetMonth = isNext => {
		const isAfter = compareAsc(endDate, addMonths(startDayOfMonth, 1)) == 1;
		const isBefore = compareAsc(startDate, subMonths(startDayOfMonth, 1)) == -1;

		if (isNext && isAfter) {
			setStartDayOfMonth(addMonths(startDayOfMonth, 1));
		} else if (!isNext && isBefore) {
			setStartDayOfMonth(subMonths(startDayOfMonth, 1));
		} else if (isNext) {
			//CHANGE HERE
		}
	};

	console.log('UPDATE: ' + startDayOfMonth);

	return (
		<div>
			Trip Calendar!
			<div className="container">
				<div className="card">
					<div className="card-header">
						<div className="row justify-content-center align-items-center">
							<div className="col">
								<button
									onClick={() => handleChangetMonth(false)}
									className="month-nav-left"
									style={{ background: 'inherit', border: 'none' }}
								>
									<BsFillCaretLeftFill />
								</button>
							</div>
							<div className="col text-center">
								<p>
									{' '}
									{startDayOfMonth.getFullYear() +
										' ' +
										MONTHS[startDayOfMonth.getMonth()]}
								</p>
							</div>
							<div className="col text-right">
								<button
									onClick={() => handleChangetMonth(true)}
									className="month-nav-right"
									style={{ background: 'inherit', border: 'none' }}
								>
									<BsFillCaretRightFill />
								</button>
							</div>
						</div>
					</div>
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
										return (
											<div className="day-container">
												<Cell className="half-day" type="AM" date={startDate} />
												<Cell className="half-day" type="PM" date={startDate} />
											</div>
										);
									})}
								</div>
							);
						})}
					</main>
				</div>
			</div>
		</div>
		// ---------------- O L D    C O D E --------------------
		// <div>
		// 	Trip Calendar!
		// 	<div className="calendar-grid">
		// 		<header className="calendar-toolbar">
		// 			<button
		// 				onClick={() => handleChangetMonth(false)}
		// 				style={{ background: 'inherit', border: 'none' }}
		// 			>
		// 				{'<'}
		// 			</button>
		// 			<p>
		// 				{' '}
		// 				{startDayOfMonth.getFullYear() +
		// 					' ' +
		// 					MONTHS[startDayOfMonth.getMonth()]}
		// 			</p>
		// 			<button
		// 				onClick={() => handleChangetMonth(true)}
		// 				style={{ background: 'inherit', border: 'none' }}
		// 			>
		// 				{'>'}
		// 			</button>
		// 		</header>
		// 		<main>
		// 			<ul className="weekday-labels">
		// 				<li>Sun</li>
		// 				<li>Mon</li>
		// 				<li>Tue</li>
		// 				<li>Wed</li>
		// 				<li>Thu</li>
		// 				<li>Fri</li>
		// 				<li>Sat</li>
		// 			</ul>
		// 			{monthArray.map(weekArr => {
		// 				return (
		// 					<div className="week-container">
		// 						{weekArr.map(day => {
		// 							return (
		// 								<div className="day-container">
		// 									<Cell className="half-day" type="AM" date={startDate} />
		// 									<Cell className="half-day" type="PM" date={startDate} />
		// 								</div>
		// 							);
		// 						})}
		// 					</div>
		// 				);
		// 			})}
		// 		</main>
		// 	</div>
		// </div>
		// ---------------- O L D    C O D E --------------------
	);
};

export default TripCalendar;