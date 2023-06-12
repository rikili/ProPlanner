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
	const monthArray = [
		[1, 2, 3, 4, 5, 6, 7],
		[5, 6, 7, 8, 9, 10, 11],
		[5, 6, 7, 8, 9, 10, 11],
		[5, 6, 7, 8, 9, 10, 11],
		[5, 6, 7, 8, 9, 10, 11],
		[5, 6, 7, 8, 9, 10, 11],
	];

	const params = useSelector(state => state.planParameters);

	//TODO: retreive the values for these from redux based on the user's inputed dateRange.

	const startDate = new Date(params.dateTimeRange[0]);
	const endDate = new Date(params.dateTimeRange[1]);

	// currDateStart stores the first day of the currently viewing month and year
	const [currDateStart, setCurrDateStart] = useState(startOfMonth(startDate));
	const [isLeftEnd, setIsLeftEnd] = useState(
		isSameMonth(currDateStart, startDate) ? true : false
	);
	const [isRightEnd, setIsRightEnd] = useState(
		isSameMonth(currDateStart, endDate) ? true : false
	);
	/**
	 * null: date range selection has not started
	 * Date: start Date range for selection { isAM: bool , date: Date }
	 */
	const [isSelectingDate, setIsSelectingDate] = useState(null);
	const [dateSelections, setDateSelections] = useState([]);

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
							const dateVal =
								(weekIndex == 0 && dayIndex < getDay(tempDate)) ||
								!isSameMonth(tempDate, currDateStart)
									? ''
									: tempDate;
							let classNameVal = 'day-container';
							let validDateVal = false;
							if (dateVal) {
								tempDate = addDays(tempDate, 1);
								classNameVal += ' validDate';
								validDateVal = true;
							}
							return (
								<div className='col' style={{ border: "1px solid green", padding: '0px', height: '100px'}}> 
									<TripHalfDay
										className={classNameVal }
										date={dateVal}
										isSelectingDate={isSelectingDate}
										setIsSelectingDate={setIsSelectingDate}
										validDate={validDateVal}
										dateSelections={dateSelections}
										setDateSelections={setDateSelections}
										type="AM"
									/>
									<TripHalfDay
										className={classNameVal}
										date={dateVal}
										isSelectingDate={isSelectingDate}
										setIsSelectingDate={setIsSelectingDate}
										validDate={validDateVal}
										dateSelections={dateSelections}
										setDateSelections={setDateSelections}
										type="PM"
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
