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
} from 'date-fns';
import { setUserSelections } from '../redux/calendarSlice';

const FIRST_HALF_HOUR = 9;
const SECOND_HALF_HOUR = 15;

const getHalfDate = (date, isFirstHalf) => set(new Date(date), {hours: isFirstHalf ? FIRST_HALF_HOUR : SECOND_HALF_HOUR})
const isFirstHalf = (dateHalf) => dateHalf.getHours() === FIRST_HALF_HOUR;

const makeMonthIndex = (date) => `${date.getMonth() + 1}-${date.getFullYear()}`;
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
	// const currUser = useSelector(state => state.user.selectedUser);
	const calendar = useSelector(state => state.tripSelections);
	const userCalendar = calendar['user1']; // TODO: remove hard-coding

	// local states
	const [currDateStart, setCurrDateStart] = useState(startOfMonth(startDate));
	let isLeftEnd = isSameMonth(currDateStart, startDate);
	let isRightEnd = isSameMonth(currDateStart, endDate);
	const [isEditMode, setIsEditMode] = useState(false);
	const calendarStart = startOfWeek(setDate(currDateStart, 1));
	const calendarEnd = endOfWeek(addWeeks(calendarStart, 5));
	const dispatch = useDispatch();

	const combinedSelections = useMemo(() => {
		// TODO: run through each user and ensure concerned months are there

		const result = {};
		Object.entries(calendar).forEach(([username, monthSelects], index) => {
			if (!isSameMonth(calendarStart, currDateStart)) {
				const prevMonthOffset = currDateStart.getDay()
				const prevMonth = monthSelects[makeMonthIndex(calendarStart)];
				const indexOfCalFirst = prevMonth.length - prevMonthOffset;
				const leadingDiff = prevMonth.length - indexOfCalFirst;
				const prevMonthIndex = makeMonthIndex(calendarStart);
				if (!index) {
					result[prevMonthIndex] = [];
					new Array(leadingDiff).fill(0).forEach(() => result[prevMonthIndex].push([]));
				}
				prevMonth.slice(indexOfCalFirst, prevMonth.length)
					.forEach((fullDay, dayIndex) => {
						addNameToDay(fullDay, result[prevMonthIndex], dayIndex, username);
					});
			}

			const currMonthIndex = makeMonthIndex(currDateStart);
			const currMonth = monthSelects[currMonthIndex];
			if (!index) {
				result[currMonthIndex] = [];
				new Array(currMonth.length).fill(0).forEach(() => result[currMonthIndex].push([]));
			}
			currMonth.forEach((fullDay, dayIndex) => addNameToDay(fullDay, result[currMonthIndex], dayIndex, username));

			if (!isSameMonth(calendarEnd, currDateStart)) {
				const nextMonthOffset = calendarEnd.getDate();
				const nextMonth = monthSelects[makeMonthIndex(calendarEnd)];
				const nextMonthIndex = makeMonthIndex(calendarEnd);
				if (!index) {
					result[nextMonthIndex] = [];
					new Array(nextMonthOffset).fill(0).forEach(() => result[nextMonthIndex].push([]));
				}
				nextMonth.slice(0, nextMonthOffset).forEach((fullDay, dayIndex) => addNameToDay(fullDay, result[nextMonthIndex], dayIndex, username));
			}
		});
		return result;
	}, [currDateStart, calendar, calendarStart, calendarEnd]);

	// stores null or first selected Date (or TripHalfDay) for date range selection
	const [isSelectingDate, setIsSelectingDate] = useState(null);

	// tracks wheter we are deleting or adding to selection
	const [isAddingSelect, setIsAdding] = useState(true);

	// stores user's date range selections (which later gets pushed into store when user submits/adds the changes)
	const [dateSelections, setSelections] = useState(JSON.parse(JSON.stringify(userCalendar))); // TODO: initial state needs to be the correct user (currently hard-coded to user1)
	// let dateSelections = JSON.parse(JSON.stringify(userCalendar));
	const [selectStart, setSelectStart] = useState(null);
	const [selectCursor, setSelectCursor] = useState(null);

	const isValidSelect = (date) => plan.availableDays.includes(getDay(date)) && date >= startDate && date <= endDate;
	const isInPreview = (dateHalf) => dateHalf <= selectCursor && dateHalf >= selectStart;
	// dateSelections = JSON.parse(JSON.stringify(userCalendar));
	const toggleEdit = () => {
		setIsEditMode(!isEditMode);
		setSelections(JSON.parse(JSON.stringify(userCalendar)));
		setSelectStart(null);
		setSelectCursor(null);
	}

	const confirmEdits = () => {
		dispatch(setUserSelections({user: 'user1', selections: dateSelections})); //TODO: change user
		toggleEdit();
	}

	const updateSelectionPrev = (dateHalf) => {
		if (isSelectingDate) {
			setSelectCursor(dateHalf);
		}
	}

	const checkSelected = (dateHalf) => {
		return dateSelections[makeMonthIndex(dateHalf)][dateHalf.getDate() - 1][isFirstHalf(dateHalf) ? 0 : 1];
	}

	const updateSelections = () => {
		let iterHalfDate = new Date(selectStart)
		let onFirstHalf = isFirstHalf(iterHalfDate);
		const newSelections = JSON.parse(JSON.stringify(dateSelections));
		
		while(selectCursor >= iterHalfDate) {
			if (isValidSelect(iterHalfDate)) {
				if (onFirstHalf) {
					newSelections[makeMonthIndex(iterHalfDate)][iterHalfDate.getDate() - 1][0] = isAddingSelect;
					iterHalfDate = getHalfDate(iterHalfDate, false);
					onFirstHalf = false;
				} else {
					newSelections[makeMonthIndex(iterHalfDate)][iterHalfDate.getDate() - 1][1] = isAddingSelect;
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
			// setSelections(JSON.parse(JSON.stringify(userCalendar)));
			setIsSelectingDate(false);
			setSelectStart(null);
			setSelectCursor(null);
		} else {
			setIsSelectingDate(dateHalf);
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

	let iterDate = new Date(calendarStart);
	let dayIndex = 0;
	let weekIndex = 0;
	let monthIndex = makeMonthIndex(iterDate);
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
			>
				<TripHalfDay
					date={new Date(firstHalfDate)}
					editable={isEditMode}
					onMouseEnter={() => updateSelectionPrev(firstHalfDate)}
					onClick={() => handleSelection(firstHalfDate)}
					selections={isEditMode ? null : firstSelects}
					isSelected={isEditMode ? firstEdit : null}
					isValid={isValidSelect(firstHalfDate)}
					isPreviewed={isInPreview(firstHalfDate)}
					style={{backgroundColor: 'yellow', height: '50%'}}
				/>
				<TripHalfDay
					date={new Date(secHalfDate)}
					editable={isEditMode}
					onMouseEnter={() => updateSelectionPrev(secHalfDate)}
					onClick={() => handleSelection(secHalfDate)}
					selections={isEditMode ? null : secondSelects}
					isSelected={isEditMode ? secondEdit : null}
					isValid={isValidSelect(secHalfDate)}
					isPreviewed={isInPreview(secHalfDate)}
					style={{backgroundColor: 'orange', height: '50%'}}
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
			let monthIndex = makeMonthIndex(iterDate);
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
			{weekArr.map((week) => {
				return <Row>
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
