import './TripCalendar.scss';
import TripHalfDay from './TripHalfDay';
import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import {
	format,
	getDay,
	startOfMonth,
	addMonths,
	subMonths,
	isSameMonth,
	addDays,
	parseISO,
	addWeeks,
	setDate,
	isAfter,
	startOfWeek,
	endOfWeek,
	set,
	startOfDay,
	endOfMonth,
} from 'date-fns';
import { setUserSelections } from '../redux/tripSlice';
import { getMonthIndex } from '../helpers/Calendar';

const FIRST_HALF_HOUR = 6;
const SECOND_HALF_HOUR = 18

const getHalfDate = (date, isFirstHalf) => set(new Date(date), {hours: isFirstHalf ? FIRST_HALF_HOUR : SECOND_HALF_HOUR})
const isFirstHalf = (dateHalf) => dateHalf.getHours() === FIRST_HALF_HOUR;

const addNameToDay = (fullDay, destArr, dayIndex, username) => {
	if (!destArr[dayIndex].length) {
		destArr[dayIndex].push([]);
		destArr[dayIndex].push([]);
	}
	if (fullDay[0]) destArr[dayIndex][0].push(username);
	if (fullDay[1]) destArr[dayIndex][1].push(username);
}

const TripCalendar = () => {
	const plan = useSelector(state => state.planParameters);
	const startDate = parseISO(plan.dateTimeRange[0]);
	const endDate = parseISO(plan.dateTimeRange[1]);
	const currUser = useSelector(state => state.user.selectedUser);
	const calendar = useSelector(state => state.tripSelections);
	let userCalendar;
	if (calendar[currUser]) {
		userCalendar = calendar[currUser];
	} else {
		userCalendar = {};
	}

	// States for calendar logic
	// First day of month (used for tracking which month is our target)
	const [currDateStart, setCurrDateStart] = useState(startOfMonth(startDate));

	// Check for whether we can move further left or right using month selectors
	let isLeftEnd = isSameMonth(currDateStart, startDate);
	let isRightEnd = isSameMonth(currDateStart, endDate);

	// Edit mode toggle
	const [isEditMode, setIsEditMode] = useState(false);

	// For backend, what months have been updated and are required to be sent to backend
	const [monthsToUpdate, setUpdateMonths] = useState([]);

	// What is the top-left first day of calendar
	const calendarStart = useMemo(() => startOfWeek(setDate(currDateStart, 1)), [currDateStart]);
	const calendarEnd = useMemo(() => endOfWeek(addWeeks(calendarStart, 5)), [calendarStart]);

	const dispatch = useDispatch();
	const combinedSelections = useMemo(() => {
		const result = {};
		Object.entries(calendar).forEach(([username, monthSelects], index) => {
			if (!isSameMonth(calendarStart, currDateStart)) {
				const daysFromPrevious = startOfMonth(currDateStart).getDay();
				const prevMonthIndex = getMonthIndex(calendarStart);
				if (!index) {
					result[prevMonthIndex] = [];
					Array(daysFromPrevious).fill(0).forEach(() => result[prevMonthIndex].push([[], []]));
				}
				const prevMonth = monthSelects[getMonthIndex(calendarStart)];
				if (prevMonth) { 
					prevMonth.slice(calendarStart.getDate(), endOfMonth(calendarStart).getDate())
						.forEach((fullDay, dayIndex) => {
							addNameToDay(fullDay, result[prevMonthIndex], dayIndex, username);
						});
				}
			}

			const currMonthIndex = getMonthIndex(currDateStart);
			const currMonth = monthSelects[currMonthIndex];
			const daysInMonth = endOfMonth(currDateStart).getDate();
			if (!index) {
				result[currMonthIndex] = [];
				new Array(daysInMonth).fill(0).forEach(() => result[currMonthIndex].push([[],[]]));
			}
			if (currMonth) {
				currMonth.forEach((fullDay, dayIndex) => addNameToDay(fullDay, result[currMonthIndex], dayIndex, username));
			}

			if (!isSameMonth(calendarEnd, currDateStart)) {
				const nextMonthOffset = calendarEnd.getDate();
				const nextMonth = monthSelects[getMonthIndex(calendarEnd)];
				const nextMonthIndex = getMonthIndex(calendarEnd);
				if (!index) {
					result[nextMonthIndex] = [];
					new Array(nextMonthOffset).fill(0).forEach(() => result[nextMonthIndex].push([[],[]]));
				}
				if (nextMonth) {
					nextMonth.slice(0, nextMonthOffset).forEach((fullDay, dayIndex) => addNameToDay(fullDay, result[nextMonthIndex], dayIndex, username));
				}
			}
		});
		return result;
	}, [currDateStart, calendar, calendarStart, calendarEnd]);

	// States for Selection Logic

	// tracks if we are doing a selection right now
	const [isSelectingDate, setIsSelectingDate] = useState(false);

	// tracks wheter we are deleting or adding to selection
	const [isAddingSelect, setIsAdding] = useState(true);

	// stores user's date range selections (which later gets pushed into store when user submits/adds the changes)
	const [dateSelections, setSelections] = useState(JSON.parse(JSON.stringify(userCalendar)));
	
	// tracks selection range (start/end)
	const [selectStart, setSelectStart] = useState(null);
	const [selectCursor, setSelectCursor] = useState(null);

	const validDOWs = useMemo(() => {
		const startDay = startOfDay(new Date(plan.dateTimeRange[0]));
		let result = [startDay.getDay()];
		let iterDate = new Date(startDay);
		const limitDate = addWeeks(startDay, 1);
		let count = 0;
		while (iterDate < limitDate && count < plan.dayOffset.length) {
			iterDate = addDays(iterDate, plan.dayOffset[count]);
			result.push(iterDate.getDay());
			count++;
		}
		return result;
	}, [plan]);

	const isValidSelect = (date) => validDOWs.includes(getDay(date)) && date >= startDate && date <= endDate;
	const isInPreview = (dateHalf) => dateHalf <= selectCursor && dateHalf >= selectStart;
	
	const resetSelecting = () => {
		setSelectStart(null);
		setSelectCursor(null);
		setIsSelectingDate(false);
	}
	
	const toggleEdit = () => {
		setIsEditMode(!isEditMode);
		setSelections(JSON.parse(JSON.stringify(userCalendar)));
		resetSelecting();
	}

	const confirmEdits = () => {
		dispatch(setUserSelections({user: currUser, selections: dateSelections}));
		setUpdateMonths([]);
		resetSelecting();
		toggleEdit();
	}

	const updateSelectionPrev = (dateHalf) => {
		if (isSelectingDate) {
			setSelectCursor(dateHalf);
		}
	}

	const checkSelected = (dateHalf) => {
		if (!dateSelections[getMonthIndex(dateHalf)]) return false;
		return dateSelections[getMonthIndex(dateHalf)][dateHalf.getDate() - 1][isFirstHalf(dateHalf) ? 0 : 1];
	}

	const updateSelections = () => {
		let iterHalfDate = new Date(selectStart)
		let onFirstHalf = isFirstHalf(iterHalfDate);
		const newSelections = JSON.parse(JSON.stringify(dateSelections));
		
		while(selectCursor >= iterHalfDate) {
			if (isValidSelect(iterHalfDate)) {
				if (!monthsToUpdate.includes(iterHalfDate.getMonth())) setUpdateMonths([...monthsToUpdate, iterHalfDate.getMonth()]);

				if (!newSelections[getMonthIndex(iterHalfDate)]) {
					newSelections[getMonthIndex(iterHalfDate)] = Array(endOfMonth(iterHalfDate).getDate()).fill(0).map(day => [false, false]);
					console.log(newSelections);
				}

				if (onFirstHalf) {
					newSelections[getMonthIndex(iterHalfDate)][iterHalfDate.getDate() - 1][0] = isAddingSelect;
					iterHalfDate = getHalfDate(iterHalfDate, false);
					onFirstHalf = false;
				} else {
					newSelections[getMonthIndex(iterHalfDate)][iterHalfDate.getDate() - 1][1] = isAddingSelect;
					onFirstHalf = true;
					iterHalfDate = getHalfDate(addDays(iterHalfDate, 1), true);
				}
			} else {
				iterHalfDate = getHalfDate(addDays(iterHalfDate, 1), true);
			}
		}
		setSelections(newSelections);
	}

	const handleSelection = (dateHalf) => {
		if (isSelectingDate) {
			updateSelections();
			resetSelecting();
		} else {
			setIsSelectingDate(true);
			setIsAdding(!checkSelected(dateHalf));
			setSelectStart(new Date(dateHalf));
			setSelectCursor(new Date(dateHalf));
		}
	}

	const updateMonthState = (newMonth) => {
		setCurrDateStart(newMonth);
		isLeftEnd = isSameMonth(newMonth, startDate);
		isRightEnd = isSameMonth(newMonth, endDate);
	}

	// updates the displaying month on the calendar
	const handleChangeMonth = (isNext) => {
		if (isNext && !isRightEnd) {
			updateMonthState(addMonths(currDateStart, 1));
		} else if (!isNext && !isLeftEnd) {
			updateMonthState(subMonths(currDateStart, 1));
		}
	};

	const maxUsers = Object.keys(calendar).length;

	let iterDate = new Date(calendarStart);
	let dayIndex = 0;
	let weekIndex = 0;
	let monthIndex = getMonthIndex(iterDate);
	let selectionArr = combinedSelections[monthIndex];
	let userSelectionArr = dateSelections[monthIndex];
	let noEditInMonth = !userSelectionArr;
	let indexLimit = combinedSelections[monthIndex].length - 1;
	let dayArr = [];
	const weekArr = [];

	while(isAfter(calendarEnd, iterDate)) {
		const firstHalfDate = getHalfDate(iterDate, true);
		const secHalfDate = getHalfDate(iterDate, false);
		
		let firstSelects = selectionArr[dayIndex][0];
		let secondSelects = selectionArr[dayIndex][1];

		let firstEdit = false;
		let secondEdit = false;
		if (!noEditInMonth) {
			const editDate = userSelectionArr[iterDate.getDate() - 1];
			firstEdit = editDate[0];
			secondEdit = editDate[1];
		}

		dayArr.push(
			<Col
				style={{
					border: '1px solid green',
					padding: '0px',
					height: '100px',
				}}
				key={`day-${dayArr.length}-container`}
			>
				<TripHalfDay
					date={new Date(firstHalfDate)}
					editable={isEditMode}
					onMouseEnter={() => updateSelectionPrev(firstHalfDate)}
					onClick={() => handleSelection(firstHalfDate)}
					selections={isEditMode ? null : firstSelects}
					maxUsers={maxUsers}
					isSelected={isEditMode ? firstEdit : null}
					isValid={isValidSelect(firstHalfDate)}
					isPreviewed={isInPreview(firstHalfDate)}
					style={{backgroundColor: 'yellow', height: '50%'}}
					key={`day-${dayArr.length}-first`}
				/>
				<TripHalfDay
					date={new Date(secHalfDate)}
					editable={isEditMode}
					onMouseEnter={() => updateSelectionPrev(secHalfDate)}
					onClick={() => handleSelection(secHalfDate)}
					selections={isEditMode ? null : secondSelects}
					maxUsers={maxUsers}
					isSelected={isEditMode ? secondEdit : null}
					isValid={isValidSelect(secHalfDate)}
					isPreviewed={isInPreview(secHalfDate)}
					style={{backgroundColor: 'orange', height: '50%'}}
					key={`day-${dayArr.length}-second`}
				/>
			</Col>
		);

		dayIndex++;
		weekIndex++;
		iterDate = addDays(iterDate, 1);

		if (weekIndex > 6) {
			weekArr.push(dayArr);
			dayArr = [];
			weekIndex = 0;
		}

		if (dayIndex > indexLimit) {
			dayIndex = 0;
			let monthIndex = getMonthIndex(iterDate);
			selectionArr = combinedSelections[monthIndex];
			userSelectionArr = dateSelections[monthIndex];
		 	noEditInMonth = !userSelectionArr;
			indexLimit = selectionArr.length - 1;
		}
	};

	return <Col className="w-50 m-auto">
		<Row className="w-100">
			<Button onClick={toggleEdit}>
				Edit
			</Button>
		</Row>
		<Row>
			<button
				onClick={() => handleChangeMonth(false)}
				style={{ background: 'inherit', border: 'none' }}
				className={isLeftEnd ? 'col highlighted' : 'col'}
			>
				{'<'}
			</button>
			{currDateStart.getFullYear() + ' ' + format(currDateStart, 'MMMM')}
			<button
				onClick={() => handleChangeMonth(true)}
				style={{ background: 'inherit', border: 'none' }}
				className={isRightEnd ? 'col highlighted' : 'col'}
			>
				{'>'}
			</button>
		</Row>
		<Row>
			{weekArr.map((week, index) => {
				return <Row key={`week-${index}`}>
					{week.map((day) => day)}
				</Row>
			})}
		</Row>
		<Row>
			<Button onClick={confirmEdits}>
				Confirm
			</Button>
		</Row>
	</Col>
};
export default TripCalendar;
