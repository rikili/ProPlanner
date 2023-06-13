import './TripCalendar.scss';
import { TripHalfDay } from './TripHalfDay.jsx';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
	parseISO,
	subDays,
	getDate
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


/**
 * returns an object where keys are “MMMM YYYY” (unique month-year combination)
 * and values are arrays of numbers displaying # of selections for each half-day of the month
 */
const processCalendar = (calendar) => {
  /**
 * returns an object:
 *  {
 * 		June 2023 : [ 1, 1, 0, 0, 3, ...],
 * 		April 2023: [0, 0, 0, 1, 3, 0],
 * 		May 2023: [0, 1, 2, 3, 3, 3, 3]
 * }
 */
};

// returns the number of users that have selected the given date (or “half-day”)
const getNumSelections = (isAm, date) => {
	const [ june2023, july2023 ] = [format(new Date('June 2, 2023 06:00:00'), 'MMMM yyyy'), format(new Date('July 15, 2023 06:00:00'), 'MMMM yyyy')];
	const usersSelections = {     //  = processCalendar(calendar, startDate, endDate);   // [2, 3, 4, 5, 6, 7, 7] size 60-62
		[june2023] : new Array(84).fill(1),
		[july2023] : new Array(84).fill(2)
	};

	let keyIndex = getDate(date) * 2 - 1;
	if (!isAm) {
		keyIndex++
	} 
	const x = usersSelections[format(date, 'MMMM yyyy')];
	if (usersSelections[format(date, 'MMMM yyyy')]) { 
		return usersSelections[format(date, 'MMMM yyyy')][keyIndex];
	}
};



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

	// stores null or first selected Date (or TripHalfDay) for date range selection
	const [isSelectingDate, setIsSelectingDate] = useState(null);  
	// stores user's date range selections (which later gets pushed into store when user submits/adds the changes)
	const [dateSelections, setDateSelections] = useState(calendar.user1); // stores user's date selections 

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
		<div className='container width' style={ { border:'solid black 1px'} }>
			<header className="row" style={ { background: 'rgb(225, 225, 225)' } }>
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
			</header> 

			<div className="row text-center" style={{ background: 'rgb(225, 225, 225)' }}>
				<div className='col'>Sun</div>
				<div className='col'>Mon</div>
				<div className='col'>Tue</div>
				<div className='col'>Wed</div>
				<div className='col'>Thu</div>
				<div className='col'>Fri</div>
				<div className='col'>Sat</div>
			</div>		
				
			{monthArray.map((weekArr, weekIndex) => {
				return (
					<div className="row">
						{weekArr.map((day, dayIndex) => {
							const dateVal = getDateVal(tempDate, dayIndex, weekIndex);
							const classNameVal = getClassName(tempDate, startDate, endDate)

							tempDate = addDays(dateVal, 1);
							
							return (
								<div className='col' style={{ border: "1px solid green", padding: '0px', height: '100px'}}> 
									<TripHalfDay
										className={classNameVal}
										date={dateVal ? new Date(dateVal.setHours(6)) : dateVal}
										key={dayIndex + weekIndex + "AM"}
										isSelectingDate={isSelectingDate}
										setIsSelectingDate={setIsSelectingDate }
										dateSelections={dateSelections}
										setDateSelections={setDateSelections}
										numSelections={getNumSelections(true, tempDate) }
									/>
									<TripHalfDay
										className={classNameVal}
										date={dateVal ? new Date(dateVal.setHours(18)): dateVal}
										key={dayIndex + weekIndex + "PM"} 
										isSelectingDate={isSelectingDate}
										setIsSelectingDate={setIsSelectingDate}
										dateSelections={dateSelections}
										setDateSelections={setDateSelections}
										numSelections={getNumSelections(false, tempDate)}
									/>
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
export default TripCalendar;
