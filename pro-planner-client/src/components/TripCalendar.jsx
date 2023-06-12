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
	subDays
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
 * returns an object array of size of (current month size) * 2, where each associate to a half-day
 * The value for each element is a number representing the number of people available for that half-day
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



const TripCalendar = () => {
	const monthArray = new Array(6).fill(new Array(7).fill(-1));

	const plan = useSelector(state => state.planParameters);
	const startDate = parseISO(plan.dateTimeRange[0]);
	const endDate = parseISO(plan.dateTimeRange[1]);
	const availableDays = parseISO(plan.availableDays)
	const calendar = useSelector(state => state.calendar);

	// local states
	const [currDateStart, setCurrDateStart] = useState(startOfMonth(startDate));
	const [isLeftEnd, setIsLeftEnd] = useState(isSameMonth(currDateStart, startDate) ? true : false);
	const [isRightEnd, setIsRightEnd] = useState(isSameMonth(currDateStart, endDate) ? true : false);


	const [ june2023, july2023 ] = [format(new Date('June 2, 2023 06:00:00'), 'MMMM yyyy'), format(new Date('July 15, 2023 06:00:00'), 'MMMM yyyy')];
	const usersSelections = {     //  = processCalendar(calendar, startDate, endDate);   // [2, 3, 4, 5, 6, 7, 7] size 60-62
		june2023 : new Array(60).fill(1),
		july2023 : new Array(62).fill(2)
	};

	

	/**
	 * null: date range selection has not started
	 * Date: start Date range for selection { isAM: bool , date: Date }
	 */
	const [isSelectingDate, setIsSelectingDate] = useState(null);  // stores null or first selected Date
	const [dateSelections, setDateSelections] = useState(calendar.user1);

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
							let classNameVal; 
							const dateVal =
								(weekIndex == 0 && dayIndex < getDay(tempDate)) ||
								!isSameMonth(tempDate, currDateStart)
									? ''
									: tempDate;
							if (dateVal) {
								tempDate = addDays(tempDate, 1);
								if (plan.availableDays.includes(getDay(subDays(tempDate, 1)))) {
									classNameVal = 'valid';
								} else {
									classNameVal = 'invalid'
								}
							}
							
							return (
								<div className='col' style={{ border: "1px solid green", padding: '0px', height: '100px'}}> 
									<TripHalfDay
										className={classNameVal}
										date={ dateVal ? new Date(dateVal.setHours(6)) : dateVal }
										isSelectingDate={isSelectingDate}
										setIsSelectingDate={setIsSelectingDate }
										dateSelections={dateSelections}
										setDateSelections={setDateSelections}
									/>
									<TripHalfDay
										className={classNameVal}
										date={ dateVal ? new Date(dateVal.setHours(18)): dateVal }
										isSelectingDate={isSelectingDate}
										setIsSelectingDate={setIsSelectingDate}
										dateSelections={dateSelections}
										setDateSelections={setDateSelections}
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
