import './TripCalendar.scss';
import axios from 'axios';
import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Button, Container, Card } from 'react-bootstrap';
import {
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
	startOfDay,
	endOfMonth,
	eachMonthOfInterval,
} from 'date-fns';
import {
	setUserSelectionsAsync,
	setUserSelections,
	setLoading,
	completeInit,
} from '../redux/tripSlice';
import { setDetailedDay, setDetailedUsers } from '../redux/summarySlice';
import { getMonthIndex } from '../helpers/Calendar';
import { getHalfDate, isFirstHalf } from '../helpers/TripCalendar';
import { buildServerRoute, getTimezone } from '../helpers/Utils';
import { setError } from '../redux/errorSlice';
import { ERR_TYPE, LOAD_STATUS } from '../constants';
import './TripCalendar.scss';
import TripDay from './TripDay';
import TripCalendarLabel from './TripCalendarLabel';
import TripWeekDayLabels from './TripWeekDayLabels';
import TripMonthSelector from './TripMonthSelector';
import { setDecisionRange } from '../redux/planParamSlice';
import UserSideBar from './UserSideBar';
import CalendarControls from './CalendarControls';

const addNameToDay = (fullDay, destArr, dayIndex, username) => {
	if (!destArr[dayIndex].length) {
		destArr[dayIndex].push([]);
		destArr[dayIndex].push([]);
	}
	if (fullDay[0]) destArr[dayIndex][0].push(username);
	if (fullDay[1]) destArr[dayIndex][1].push(username);
};

const TripCalendar = ({ tripId, isEditMode, setIsEditMode, selectedUser }) => {
	const plan = useSelector(state => state.planParameters);
	const startDate = parseISO(plan.dateTimeRange[0]);
	const endDate = parseISO(plan.dateTimeRange[1]);
	const users = useSelector(state => state.user.userList);
	const currUser = useSelector(state => state.user.selectedUser);
	const calendar = useSelector(state => state.tripSelections.selections);
	const isLoading = useSelector(state => state.tripSelections.isLoading);
	const isInitDone = useSelector(state => state.tripSelections.isInitDone);
	const hasUpdateFailed =
		useSelector(state => state.tripSelections.updateStatus) ===
		LOAD_STATUS.FAILED;

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
	// const [isEditMode, setIsEditMode] = useState(false);

	// Deciding mode toggle
	const [isDeciding, setIsDeciding] = useState(false);
	const [decisionStart, setDecisionStart] = useState(null);
	const [decisionCursor, setDecisionCursor] = useState(null);
	const [decisionEditRange, setDecisionEdit] = useState(null);

	// For backend, what months have been updated and are required to be sent to backend
	const [monthsToUpdate, setUpdateMonths] = useState([]);

	// What is the top-left first day of calendar
	const calendarStart = useMemo(
		() => startOfWeek(setDate(currDateStart, 1)),
		[currDateStart]
	);
	const calendarEnd = useMemo(
		() => endOfWeek(addWeeks(calendarStart, 5)),
		[calendarStart]
	);

	const dispatch = useDispatch();
	useEffect(() => {
		const controller = new AbortController();
		const promiseTrack = [];

		dispatch(setLoading(true));
		for (let user of users) {
			eachMonthOfInterval({
				start: calendarStart,
				end: calendarEnd,
			}).forEach(month => {
				const monthIndex = getMonthIndex(month);
				const userReq = axios.get(buildServerRoute('trip', tripId, user), {
					params: {
						month: monthIndex,
						timezone: getTimezone(),
					},
					signal: controller.signal,
				});
				userReq
					.then(result => {
						dispatch(
							setUserSelections({
								userId: user,
								monthIndex: monthIndex,
								data: result.data.month,
							})
						);
					})
					.catch(() => {});
				promiseTrack.push(userReq);
			});
		}

		Promise.all(promiseTrack)
			.then(() => {
				dispatch(setLoading(false));
				dispatch(completeInit());
			})
			.catch(e => {
				if (e.request.status === 0) return;
				dispatch(
					setError({
						errType: ERR_TYPE.ERR,
						message:
							'Month information could not be fetched, please try again later. Close this notification to be redirected to the landing page.',
						redirect: '/',
						disableControl: true,
					})
				);
			});
		return () => {
			controller.abort();
		};
	}, [calendarEnd, calendarStart, dispatch, tripId, users]);

	const combinedSelections = useMemo(() => {
		const result = {};

		Object.entries(calendar).forEach(([username, monthSelects], index) => {
			//case 1
			if (!isSameMonth(calendarStart, currDateStart)) {
				const daysFromPrevious = startOfMonth(currDateStart).getDay();
				const prevMonthIndex = getMonthIndex(calendarStart);
				if (!index) {
					result[prevMonthIndex] = [];
					Array(daysFromPrevious)
						.fill(0)
						.forEach(() => result[prevMonthIndex].push([[], []]));
				}
				const prevMonth = monthSelects[getMonthIndex(calendarStart)];
				if (prevMonth) {
					prevMonth
						.slice(
							calendarStart.getDate() - 1,
							endOfMonth(calendarStart).getDate()
						)
						.forEach((fullDay, dayIndex) => {
							addNameToDay(fullDay, result[prevMonthIndex], dayIndex, username);
						});
				}
			}

			//case 2

			const currMonthIndex = getMonthIndex(currDateStart);
			const currMonth = monthSelects[currMonthIndex];
			const daysInMonth = endOfMonth(currDateStart).getDate();
			if (!index) {
				result[currMonthIndex] = [];
				new Array(daysInMonth)
					.fill(0)
					.forEach(() => result[currMonthIndex].push([[], []]));
			}
			if (currMonth) {
				currMonth.forEach((fullDay, dayIndex) =>
					addNameToDay(fullDay, result[currMonthIndex], dayIndex, username)
				);
			}

			//case 3
			if (!isSameMonth(calendarEnd, currDateStart)) {
				const nextMonthOffset = calendarEnd.getDate();
				const nextMonth = monthSelects[getMonthIndex(calendarEnd)];
				const nextMonthIndex = getMonthIndex(calendarEnd);
				if (!index) {
					result[nextMonthIndex] = [];
					new Array(nextMonthOffset)
						.fill(0)
						.forEach(() => result[nextMonthIndex].push([[], []]));
				}
				if (nextMonth) {
					nextMonth
						.slice(0, nextMonthOffset)
						.forEach((fullDay, dayIndex) =>
							addNameToDay(fullDay, result[nextMonthIndex], dayIndex, username)
						);
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
	const [dateSelections, setSelections] = useState(
		JSON.parse(JSON.stringify(userCalendar))
	);

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

	const isDateValid = date =>
		validDOWs.includes(getDay(date)) && date >= startDate && date <= endDate;
	const isDateInPreview = date => {
		if (isDeciding) {
			return decisionStart && decisionCursor
				? date <= decisionCursor && date >= decisionStart
				: false;
		}
		return date <= selectCursor && date >= selectStart;
	};

	const resetSelecting = () => {
		setSelectStart(null);
		setSelectCursor(null);
		setIsSelectingDate(false);
	};

	const toggleEdit = () => {
		if (!isEditMode) {
			// entering edit
			setSelections(JSON.parse(JSON.stringify(userCalendar)));
			dispatch(setDetailedDay(null));
			dispatch(setDetailedUsers([]));
		} else {
			resetSelecting();
		}
		setIsEditMode(!isEditMode);
	};

	const confirmEdits = () => {
		for (let monthIndex of monthsToUpdate) {
			dispatch(
				setUserSelectionsAsync({
					tripId,
					userId: currUser,
					newSelections: dateSelections[monthIndex],
					monthIndex,
				})
			);
		}
		setUpdateMonths([]);
		resetSelecting();
		toggleEdit();
	};

	const updateSelectionPrev = dateHalf => {
		if (isDeciding) {
			setDecisionCursor(dateHalf);
		}

		if (isSelectingDate) {
			setSelectCursor(dateHalf);
		}
	};

	const checkSelected = dateHalf => {
		if (!dateSelections[getMonthIndex(dateHalf)]) return false;
		return dateSelections[getMonthIndex(dateHalf)][dateHalf.getDate() - 1][
			isFirstHalf(dateHalf) ? 0 : 1
		];
	};

	const updateSelections = () => {
		let iterHalfDate = new Date(selectStart);
		let onFirstHalf = isFirstHalf(iterHalfDate);
		const newSelections = JSON.parse(JSON.stringify(dateSelections));
		const editedMonths = [];

		while (selectCursor >= iterHalfDate) {
			if (isDateValid(iterHalfDate)) {
				if (
					!monthsToUpdate.includes(getMonthIndex(iterHalfDate)) &&
					!editedMonths.includes(getMonthIndex(iterHalfDate))
				) {
					editedMonths.push(getMonthIndex(iterHalfDate));
				}

				if (!newSelections[getMonthIndex(iterHalfDate)]) {
					newSelections[getMonthIndex(iterHalfDate)] = Array(
						endOfMonth(iterHalfDate).getDate()
					)
						.fill(0)
						.map(() => [false, false]);
				}

				if (onFirstHalf) {
					newSelections[getMonthIndex(iterHalfDate)][
						iterHalfDate.getDate() - 1
					][0] = isAddingSelect;
					iterHalfDate = getHalfDate(iterHalfDate, false);
					onFirstHalf = false;
				} else {
					newSelections[getMonthIndex(iterHalfDate)][
						iterHalfDate.getDate() - 1
					][1] = isAddingSelect;
					onFirstHalf = true;
					iterHalfDate = getHalfDate(addDays(iterHalfDate, 1), true);
				}
			} else {
				iterHalfDate = getHalfDate(addDays(iterHalfDate, 1), true);
			}
		}

		setUpdateMonths([...monthsToUpdate, ...editedMonths]);
		setSelections(newSelections);
	};

	const handleSelection = dateHalf => {
		if (isDeciding) {
			if (decisionStart === null) {
				setDecisionStart(dateHalf);
				setDecisionCursor(dateHalf);
			} else {
				if (decisionStart <= decisionCursor)
					setDecisionEdit([new Date(decisionStart), new Date(decisionCursor)]);
				setDecisionStart(null);
				setDecisionCursor(null);
			}
		} else {
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
	};

	const updateMonthState = newMonth => {
		setCurrDateStart(newMonth);
		isLeftEnd = isSameMonth(newMonth, startDate);
		isRightEnd = isSameMonth(newMonth, endDate);
	};

	// updates the displaying month on the calendar
	const handleChangeMonth = isNext => {
		if (isNext && !isRightEnd) {
			updateMonthState(addMonths(currDateStart, 1));
		} else if (!isNext && !isLeftEnd) {
			updateMonthState(subMonths(currDateStart, 1));
		}
	};

	if (hasUpdateFailed) {
		dispatch(
			setError({
				errType: ERR_TYPE.ERR,
				message: 'Updating of selections has failed. Please try again.',
				disableControl: false,
			})
		);
	}

	// Compile final renderings of calendar grid
	if (
		!(
			isInitDone &&
			Object.values(combinedSelections).length &&
			!hasUpdateFailed
		)
	)
		return <div></div>;

	const maxUsers = Object.keys(calendar).length;
	let iterDate = new Date(calendarStart);
	let dayIndex = 0;
	let weekIndex = 0;
	let monthIndex = getMonthIndex(iterDate);
	let selectionArr = combinedSelections[monthIndex];
	let userSelectionArr = dateSelections[monthIndex];
	let editsInMonth = !!userSelectionArr;
	let indexLimit = combinedSelections[monthIndex].length - 1;
	let dayArr = [];
	const weekArr = [];

	while (isAfter(calendarEnd, iterDate)) {
		const editSelections = { first: false, second: false };
		if (editsInMonth) {
			editSelections.first = userSelectionArr[iterDate.getDate() - 1][0];
			editSelections.second = userSelectionArr[iterDate.getDate() - 1][1];
		}
		dayArr.push(
			<TripDay
				date={new Date(iterDate)}
				selections={selectionArr[dayIndex]}
				editing={isEditMode}
				deciding={isDeciding}
				decisionSelect={decisionEditRange}
				onMouseEnter={updateSelectionPrev}
				onClick={handleSelection}
				maxUsers={maxUsers}
				isSelected={editSelections}
				checkValid={isDateValid}
				checkPreview={isDateInPreview}
				className="half-day"
				key={`day-${dayArr.length}`}
				selectedUser={selectedUser}
			/>
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
			editsInMonth = !!userSelectionArr;
			indexLimit = selectionArr.length - 1;
		}
	}

	const toggleDecision = () => {
		if (!isDeciding) {
			setIsDeciding(true);
			return;
		}
		setIsDeciding(false);
		setDecisionStart(null);
		setDecisionCursor(null);
		setDecisionEdit(null);
	};

	const confirmDecision = () => {
		if (decisionEditRange) {
			dispatch(
				setDecisionRange([
					decisionEditRange[0].toISOString(),
					decisionEditRange[1].toISOString(),
				])
			);
			// TODO: fire async call for decision range
		}
		setDecisionStart(null);
		setDecisionCursor(null);
		setDecisionEdit(null);
		setIsDeciding(false);
	};

    return (
        <>
            {isInitDone && (
                <Card className="calendar-card">
                    <Card.Body>
                        <Col className="trip-calendar">
                            <TripCalendarLabel
                                date={currDateStart}
                                onClick={handleChangeMonth}
                                startRange={startDate}
                                endRange={endDate}
                            />
                            <TripMonthSelector
                                selectedMonth={currDateStart}
                                setSelectedMonth={setCurrDateStart}
                                rangeStart={startDate}
                                rangeEnd={endDate}
                            />
                            <TripWeekDayLabels />
                            <Container className="trip-calendar-container">
                                <Container className="trip-border" />
                                {isLoading
                                    ? Array(6)
                                          .fill(0)
                                          .map((_, index) => {
                                              return (
                                                  <Container key={`week-${index}`} className="trip-day-container">
                                                      {Array(6)
                                                          .fill(0)
                                                          .map((_, index) => (
                                                              <TripDay
                                                                  fake
                                                                  className="trip-half-container"
                                                                  key={`load-day-${index}`}
                                                              />
                                                          ))}
                                                  </Container>
                                              );
                                          })
                                    : weekArr.map((week, index) => {
                                          return (
                                              <Container key={`week-${index}`} className="trip-day-container">
                                                  {week.map((day) => day)}
                                              </Container>
                                          );
                                      })}
                            </Container>
                            <CalendarControls toggleEdit={toggleEdit}
                                                  editing={isEditMode}
                                                  toggleDecision={toggleDecision}
                                                  confirmDecisions={confirmDecision}
                                                  deciding={isDeciding}
                                                  confirmEdit={confirmEdits}
                                                  />
                        </Col>
                    </Card.Body>
                </Card>
            )}
        </>
    );
};
export default TripCalendar;
