import './TripCalendar.scss';
import { TripHalfDay } from './TripHalfDay.jsx';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {Container, Row, Col, Button} from 'react-bootstrap';
import {
	format,
	compareAsc,
	getDay,
	startOfMonth,
	endOfMonth,
	addMonths,
	subMonths,
	getHours,
	isSameMonth,
	addDays,
	addHours,
	parseISO,
	subDays,
	getDate,
	getDaysInMonth
} from 'date-fns';
import UserSelectionPage from '../routes/UserSelectionPage';
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



// updates calendarSlice with the user's new inputs
// called when user submits/adds new inputs
// called only in edit calendar mode
const updateCalendar = (calendar) => {
	// dispatches
};

/**
 * if isTrip:
 * 	returns an object where keys are “MMMM YYYY” (unique month-year combination)
 * 	and values are arrays of numbers displaying # of selections for each half-day of the month
 * else:
 * 	returns an object where keys are "MMMMYY"
 */
const processCalendar = (isTrip, calendar) => {
	let result = {};
	let allSelectedRanges = Object.values(calendar)

	allSelectedRanges.forEach( user => { 
		user.forEach( range => {
			let [startDate, endDate] = range;
			let currDate = startDate;
			while (currDate <= endDate) {
				const monthKey = format(currDate, "MM-yyyy")
				
				let halfDayIndex = getHalfDayIndex(currDate)
				
				if (!result[monthKey]) {
					const numDaysInMonth = getDaysInMonth(currDate);
					result[monthKey] = new Array(60).fill(0); 
				}
				result[monthKey][halfDayIndex]++
				currDate = addHours(currDate, 12);
			}
		})
	});
	return result;
};


const getHalfDayIndex = (date) => { 
	const isAM = getHours(date) < 12;
	let keyIndex = (getDate(date) - 1) * 2;
	return (isAM) ? keyIndex : keyIndex + 1;
}


const TripCalendar = () => {
	const monthArray = new Array(6).fill(new Array(7).fill(-1));

	const plan = useSelector(state => state.planParameters);
	const startDate = parseISO(plan.dateTimeRange[0]);
	const endDate = parseISO(plan.dateTimeRange[1]);
	const calendar = useSelector(state => state.calendar);

	// local states
	const [currDateStart, setCurrDateStart] = useState(startOfMonth(startDate));
	const [isLeftEnd, setIsLeftEnd] = useState(isSameMonth(currDateStart, startDate) ? true : false);
	const [isRightEnd, setIsRightEnd] = useState(isSameMonth(currDateStart, endDate) ? true : false);
	const [isEditMode, setIsEditMode] = useState(false);

	// stores null or first selected Date (or TripHalfDay) for date range selection
	const [isSelectingDate, setIsSelectingDate] = useState(null);  
	// stores user's date range selections (which later gets pushed into store when user submits/adds the changes)
	const [dateSelections, setDateSelections] = useState(calendar.user1);  // TODO: initial state needs to be the correct user (currently hard-coded to user1)

	useEffect(() => {
		setIsLeftEnd(isSameMonth(currDateStart, startDate));
		setIsRightEnd(isSameMonth(currDateStart, endDate));
	}, [currDateStart]);

	// updates the displaying month on the calendar
	const handleChangeMonth = isNext => {
		if (isNext && !isRightEnd) {
			setCurrDateStart(addMonths(currDateStart, 1));
		} else if (!isNext && !isLeftEnd) {
			setCurrDateStart(subMonths(currDateStart, 1));
		}
	}; 

	const usersSelections = processCalendar(true, calendar);


	// returns the number of users that have selected the given date (or “half-day”)
	const getNumSelections = (date) => {
		let halfDayIndex = getHalfDayIndex(date);
		const validMonth = usersSelections[format(date, 'MM-yyyy')];
		return validMonth ? validMonth[halfDayIndex] : null;
	};


	// returns the associated date for each half-day cell (or TripHalfDay)
	const getDateVal = (tempDate, dayIndex, weekIndex) => {
		if (weekIndex == 0 && dayIndex < getDay(tempDate) || !isSameMonth(tempDate, currDateStart)) {
			return subDays(tempDate, getDay(tempDate) - dayIndex);
		}
		return tempDate;
	};

	// returns “valid” or “invalid” depending on whether the given date is valid/availble for scheduling
    // “valid” means date is within the plan’s available date range and a possible day of the week
	const getClassName = (tempDate, startDate, endDate) => {
		if (plan.availableDays.includes(getDay(tempDate)) && (tempDate >= startDate) && (tempDate <= endDate)) {
			return 'valid';
		}
		return 'invalid';
	};

	let tempDate = currDateStart;
		
	return (
		<Container className='width' style={ { border:'solid black 1px'} }>
			<Row style={ { background: 'rgb(225, 225, 225)' } }>
				<button 
					className="btn btn-primary"
					onClick={ () => setIsEditMode(!isEditMode) }
				> 
					{ (isEditMode) ? "Add" : "Edit" }
				</button>
				<button
					onClick={() => handleChangeMonth(false)}
					style={{ background: 'inherit', border: 'none' }}
					className={isLeftEnd ? 'col highlighted' : 'col'}
				>
					{'<'}
				</button>
				{currDateStart.getFullYear() + ' ' + MONTHS[currDateStart.getMonth()]}
				<button
					onClick={() => handleChangeMonth(true)}
					style={{ background: 'inherit', border: 'none' }}
					className={isRightEnd ? 'col highlighted' : 'col'}
				>
					{'>'}
				</button> 
			</Row> 

			<Row className="text-center" style={{ background: 'rgb(225, 225, 225)' }}>
				<div className='col'>Sun</div>
				<div className='col'>Mon</div>
				<div className='col'>Tue</div>
				<div className='col'>Wed</div>
				<div className='col'>Thu</div>
				<div className='col'>Fri</div>
				<div className='col'>Sat</div>
			</Row>		

			{monthArray.map((weekArr, weekIndex) => {
				return (
					<Row>
						{weekArr.map((day, dayIndex) => {
							const dateVal = getDateVal(tempDate, dayIndex, weekIndex);
							const classNameVal = getClassName(tempDate, startDate, endDate)
							tempDate = addDays(dateVal, 1);
							
							return (
								<Col style={{ border: "1px solid green", padding: '0px', height: '100px'}}> 
									<TripHalfDay
										className={classNameVal}
										date={dateVal ? new Date(dateVal.setHours(6)) : dateVal}
										key={dayIndex + weekIndex + "AM"}
										isSelectingDate={isSelectingDate}
										setIsSelectingDate={setIsSelectingDate}
										dateSelections={dateSelections}
										setDateSelections={setDateSelections}
										numSelections={getNumSelections(dateVal ? new Date(dateVal.setHours(6)) : dateVal)}
										isEditMode={isEditMode}
									/>
									<TripHalfDay
										className={classNameVal}
										date={dateVal ? new Date(dateVal.setHours(18)): dateVal}
										key={dayIndex + weekIndex + "PM"} 
										isSelectingDate={isSelectingDate}
										setIsSelectingDate={setIsSelectingDate}
										dateSelections={dateSelections}
										setDateSelections={setDateSelections}
										numSelections={getNumSelections(dateVal ? new Date(dateVal.setHours(18)): dateVal)}
										isEditMode={isEditMode}
									/>
								</Col>
							);
						})}
					</Row>
				);
			})}
		</Container>
	);
};
export default TripCalendar;
