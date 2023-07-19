// getting date info referencs https://stackoverflow.com/questions/47607666/how-to-extract-only-time-from-iso-date-format-in-javascript
// adding days to date references https://stackoverflow.com/questions/563406/how-to-add-days-to-date
// code references https://date-fns.org/docs/Getting-Started
// disable button references https://stackoverflow.com/questions/38196743/conditionally-set-the-disabled-state-of-a-bootstrap-button
// conditional className references https://stackoverflow.com/questions/30533171/react-js-conditionally-applying-class-attributes

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	isAfter,
	subWeeks,
	startOfWeek,
	endOfWeek,
	addWeeks,
	eachDayOfInterval,
	endOfDay,
	isWithinInterval,
	format,
	isSameDay,
} from 'date-fns';
import { Row, Col, Container } from 'react-bootstrap';
import { getMonthIndex } from '../helpers/Calendar';
import {
	generateSlots,
	selectToInterval,
	getTime,
	getEndOfSegment,
	isLooseEndOfDay,
} from '../helpers/OutingCalendar';
import { setUserSelections } from '../redux/outingSlice';

import OutingDay from './OutingDay';
import OutingHourLabels from './OutingHourLabels';
import Button from 'react-bootstrap/Button';
import UserSideBar from './UserSideBar';
import { useEffect } from 'react';

// Update working selections for current user
const updateSelections = (
	currSelects,
	selectStart,
	selectEnd,
	slots,
	isAdding
) => {
	eachDayOfInterval({
		start: selectStart,
		end: selectEnd,
	}).forEach(dayStart => {
		const isStartDay = isSameDay(dayStart, selectStart);
		const isEndDay = isSameDay(dayStart, selectEnd);

		const monthIndex = getMonthIndex(dayStart);
		const dateIndex = dayStart.getDate();

		if (!currSelects[monthIndex]) currSelects[monthIndex] = {};
		if (!currSelects[monthIndex][dateIndex])
			currSelects[monthIndex][dateIndex] = [];
		const selectsInDay = currSelects[monthIndex][dateIndex];

		const startInDay = isStartDay ? selectStart : null;
		const endInDay = isEndDay ? selectEnd : null;

		const updatedDay = makeSelectsOfDate(
			dayStart,
			selectsInDay,
			slots[monthIndex][dateIndex],
			startInDay,
			endInDay,
			isAdding
		);
		currSelects[monthIndex][dateIndex] = mergeNeighbours(updatedDay);
	});
};

// Compile new selections for a particular date based on anchor/cursor of selection
const makeSelectsOfDate = (date, selections, slots, start, end, isAdding) => {
	if (!slots) {
		return [];
	}
	const convSelects = selections.map(selectInterval =>
		selectToInterval(date, selectInterval)
	);
	const startPoint = start ?? new Date(slots[0][0]);
	const endPoint = end ?? endOfDay(date);

	const startCheck = findSelectBoundary(startPoint, convSelects, true);
	const endCheck = findSelectBoundary(endPoint, convSelects, false);

	let isEndHandled = false;
	let resultArr = [];
	if (startCheck.affectedIndex !== 0) {
		const restoreLimit = startCheck.affectedIndex ?? selections.length;
		for (let count = 0; count < restoreLimit; count++) {
			resultArr.push(selections[count]);
		}
	}

	if (isAdding) {
		let timeToAdd = [getTime(startPoint)];
		let foundStart = false;
		for (let count = 0; count < slots.length; count++) {
			const currentSlot = slots[count];
			const slotInterval = {
				start: currentSlot[0],
				end: formatToEndOfDay(currentSlot[1]),
			};

			if (foundStart) timeToAdd = [getTime(slotInterval.start)];
			if (isWithinInterval(startPoint, slotInterval)) {
				foundStart = true;
			}

			if (foundStart) {
				timeToAdd.push(getTime(slotInterval.end));

				if (isWithinInterval(endPoint, slotInterval)) {
					isEndHandled = true;
					if (endCheck.inInterval) {
						timeToAdd[1] = selections[endCheck.affectedIndex][1];
					} else {
						timeToAdd[1] = getTime(endPoint);
					}
				}

				resultArr.push(timeToAdd);
				if (isEndHandled) break;
			}
		}
	} else {
		if (startCheck.inInterval) {
			const startTime = selections[startCheck.affectedIndex][0];
			const endTime = getTime(startPoint);
			if (startTime !== endTime) resultArr.push([startTime, endTime]);
		}
		if (endCheck.inInterval) {
			const startTime = getTime(endPoint);
			const endTime = selections[endCheck.affectedIndex][1];
			if (startTime !== endTime) resultArr.push([startTime, endTime]);
		}
	}

	if (endCheck.affectedIndex !== null) {
		const iterStart = endCheck.inInterval
			? endCheck.affectedIndex + 1
			: endCheck.affectedIndex;
		for (let count = iterStart; count < selections.length; count++) {
			resultArr.push(selections[count]);
		}
	}
	return resultArr;
};

// Find where a dateTime lies within a list of intervals
const findSelectBoundary = (boundary, selections, isStart) => {
	const boundaryCheck = {
		inInterval: false, // is in the middle of a selection
		affectedIndex: null, // will either be index of selections that needs to be modified or first to be ignored
	};

	selections.forEach((interval, index) => {
		if (!isStart && getTime(boundary) === getTime(interval.start)) {
			boundaryCheck.affectedIndex = index;
		} else if (isStart && getTime(boundary) === getTime(interval.end)) {
			boundaryCheck.affectedIndex = index;
		} else if (isWithinInterval(boundary, interval)) {
			boundaryCheck.inInterval = true;
			boundaryCheck.affectedIndex = index;
		} else if (isAfter(interval.start, boundary)) {
			if (boundaryCheck.affectedIndex === null)
				boundaryCheck.affectedIndex = index;
		}
	});
	return boundaryCheck;
};

// Properly format to end of date object, otherwise do return date
const formatToEndOfDay = date => {
	if (isLooseEndOfDay(date)) return endOfDay(date);
	return date;
};

// Combine neighbouring selections
const mergeNeighbours = sourceIntervals => {
	const result = [];
	if (!sourceIntervals.length) return [];
	let trackStart = sourceIntervals[0][0];
	let trackEnd = sourceIntervals[0][1];
	if (sourceIntervals.length === 1) {
		result.push([trackStart, trackEnd]);
	} else {
		sourceIntervals.forEach(([start, end], index) => {
			if (index === 0) return;

			if (trackEnd === start) {
				trackEnd = end;
			} else {
				result.push([trackStart, trackEnd]);
				trackStart = start;
				trackEnd = end;
			}

			if (index === sourceIntervals.length - 1) {
				result.push([trackStart, trackEnd]);
			}
		});
	}
	return result;
};

// Check if inputted start + end of week contains valid slots or is after a given boundary date
const checkAnyAvailable = (weekStart, weekEnd, dates, endBoundary) => {
	const result = eachDayOfInterval({ start: weekStart, end: weekEnd }).reduce(
		(acc, day) => {
			return (
				acc ||
				(!!dates[getMonthIndex(day)] &&
					!!dates[getMonthIndex(day)][day.getDate()] &&
					isAfter(endBoundary, day))
			);
		},
		false
	);
	return result;
};

function OutingCalendar() {
	const params = useSelector(state => state.planParameters);
	const endDay = new Date(params.dateTimeRange[1]);

	const currentUser = useSelector(state => state.user.selectedUser);
	const selections = useSelector(state => state.outingSelections);
	const [selectWeek, setSelectWeek] = useState([
		startOfWeek(new Date(params.dateTimeRange[0][0])),
		endOfWeek(new Date(params.dateTimeRange[0][0])),
	]);
	const [isSelecting, setIsSelecting] = useState(false);
	const [isAdding, setIsAdding] = useState(true);
	const [selectCursor, setCursor] = useState(null);
	const [selectAnchor, setAnchor] = useState(null);
	const [currentSelects, setCurrSelects] = useState(
		!!selections[currentUser]
			? JSON.parse(JSON.stringify(selections[currentUser]))
			: {}
	);
	const [isEditing, setEditing] = useState(false);
	const dispatch = useDispatch();

	//passed down to userSideBar
	const [selectedUser, setSelectedUser] = useState(null);

	let slots = useMemo(() => generateSlots(params), [params]);

	const onEnterSegment = dateTime => {
		if (isSelecting) {
			setCursor(dateTime);
		}
	};

	const toggleEdit = () => {
		if (isEditing) {
			setAnchor(null);
			setCursor(null);
			dispatch(
				setUserSelections({ user: currentUser, selections: currentSelects })
			);
			setIsSelecting(false);
		}
		setEditing(!isEditing);
	};

	const onSelectClick = (dateTime, isSelected) => {
		if (!isSelecting) {
			setIsSelecting(true);
			setIsAdding(!isSelected);
			setAnchor(dateTime);
			setCursor(getEndOfSegment(dateTime));
			return;
		}

		const updateCopy = JSON.parse(JSON.stringify(currentSelects));
		if (isAfter(selectCursor, selectAnchor)) {
			updateSelections(updateCopy, selectAnchor, selectCursor, slots, isAdding);
		}
		setCurrSelects(updateCopy);
		setIsSelecting(false);
		setAnchor(null);
		setCursor(null);
	};

	const nextWeek = [addWeeks(selectWeek[0], 1), addWeeks(selectWeek[1], 1)];
	const prevWeek = [subWeeks(selectWeek[0], 1), subWeeks(selectWeek[1], 1)];
	function changeWeek(type) {
		if (type && checkAnyAvailable(nextWeek[0], nextWeek[1], slots, endDay)) {
			setSelectWeek(nextWeek);
		} else if (
			!type &&
			checkAnyAvailable(prevWeek[0], prevWeek[1], slots, endDay)
		) {
			setSelectWeek(prevWeek);
		}
	}

	const getDayRanges = (date, yearObject) => {
		if (yearObject[getMonthIndex(date)]) {
			if (yearObject[getMonthIndex(date)][date.getDate()]) {
				return yearObject[getMonthIndex(date)][date.getDate()];
			}
		}
		return null;
	};

	const selectsInDay = (date, selections) => {
		const result = {};
		if (selectedUser) {
			// console.log(selections[selectedUser]);
			result[selectedUser] = getDayRanges(date, selections[selectedUser]);
		} else {
			Object.entries(selections).forEach(([user, userSelects]) => {
				result[user] = getDayRanges(date, userSelects);
			});
		}
		return result;
	};

	return (
		<Container>
			<Col className="d-flex flex-row mb-2">
				<Button
					key={'edit'}
					onClick={toggleEdit}
					style={{ backgroundColor: isEditing ? 'red' : 'blue' }}
				>
					edit
				</Button>
				<Button
					onClick={() => changeWeek(false)}
					disabled={!checkAnyAvailable(prevWeek[0], prevWeek[1], slots, endDay)}
				>
					prev
				</Button>
				<Button
					onClick={() => changeWeek(true)}
					disabled={!checkAnyAvailable(nextWeek[0], nextWeek[1], slots, endDay)}
				>
					next
				</Button>
			</Col>
			<Row>
				<Col className="d-flex flex-row w-75 m-auto">
					<OutingHourLabels />
					{eachDayOfInterval({ start: selectWeek[0], end: selectWeek[1] }).map(
						(day, index) => {
							const editsForDay = currentSelects[getMonthIndex(day)]
								? currentSelects[getMonthIndex(day)][day.getDate()]
								: null;
							return (
								<Row
									className="w-100"
									key={`dayCol-${format(day, 'yyyy-MM-dd')}`}
								>
									<div className="text-center">{format(day, 'MMM dd')}</div>
									<OutingDay
										key={`daySegments-${format(day, 'yyyy-MM-dd')}`}
										date={new Date(day)}
										slots={getDayRanges(day, slots)}
										selections={selectsInDay(day, selections)}
										editSelections={editsForDay}
										isFirstDay={index === 0}
										onSegmentClick={onSelectClick}
										onSegmentEnter={onEnterSegment}
										isEditing={isEditing}
										currentUser={currentUser}
										anchor={selectAnchor}
										cursor={selectCursor}
									/>
								</Row>
							);
						}
					)}
				</Col>
				<Col className="d-flex flex-row w-25 m-auto" sm={2}>
					<UserSideBar
						isEditing={isEditing}
						selectedUser={selectedUser}
						setSelectedUser={setSelectedUser}
					/>
				</Col>
			</Row>
		</Container>
	);
}

export default OutingCalendar;
