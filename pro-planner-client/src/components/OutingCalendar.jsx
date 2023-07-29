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
    isEqual,
    eachMonthOfInterval,
} from 'date-fns';
import { Card } from 'react-bootstrap';
import { getMonthIndex } from '../helpers/Calendar';
import { generateSlots, selectToInterval, getTime, getEndOfSegment, isLooseEndOfDay, isTimeBefore } from '../helpers/OutingCalendar';
import { setUserSelections } from '../redux/outingSlice';

import OutingDay from './OutingDay';
import OutingHourLabels from './OutingHourLabels';
import './OutingCalendar.scss';
import CalendarControls from './CalendarControls';
import OutingCalendarLabel from './OutingCalendarLabel';
import { setDecisionRange } from '../redux/planParamSlice';
import axios from 'axios';

// Update working selections for current user
const updateSelections = (currSelects, selectStart, selectEnd, slots, isAdding) => {
    eachDayOfInterval({
        start: selectStart,
        end: selectEnd
    }).forEach((dayStart) => {
        const isStartDay = isSameDay(dayStart, selectStart);
        const isEndDay = isSameDay(dayStart, selectEnd);

        const monthIndex = getMonthIndex(dayStart);
        const dateIndex = dayStart.getDate();

        if (!currSelects[monthIndex]) currSelects[monthIndex] = {};
        if (!currSelects[monthIndex][dateIndex]) currSelects[monthIndex][dateIndex] = [];
        const selectsInDay = currSelects[monthIndex][dateIndex];

        const startInDay = isStartDay ? selectStart : null;
        const endInDay = isEndDay ? selectEnd : null;

        const updatedDay = makeSelectsOfDate(dayStart, selectsInDay, slots[monthIndex][dateIndex], startInDay, endInDay, isAdding);
        currSelects[monthIndex][dateIndex] = mergeNeighbours(updatedDay);
    });
};

// Compile new selections for a particular date based on anchor/cursor of selection
const makeSelectsOfDate = (date, selections, slots, start, end, isAdding) => {
    if (!slots) {
        return [];
    }
    const convSelects = selections.map((selectInterval) => selectToInterval(date, selectInterval));
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
            const slotInterval = {start: currentSlot[0], end: formatToEndOfDay(currentSlot[1])};

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
        const iterStart = endCheck.inInterval ? endCheck.affectedIndex + 1 : endCheck.affectedIndex;
        for (let count = iterStart; count < selections.length; count++) {
            resultArr.push(selections[count]);
        }
    }
    return resultArr;
};

// Find where a dateTime lies within a list of intervals
const findSelectBoundary = (boundary, selections, isStart) => {
    const boundaryCheck = {
        inInterval: false,      // is in the middle of a selection
        affectedIndex: null     // will either be index of selections that needs to be modified or first to be ignored
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
            if (boundaryCheck.affectedIndex === null) boundaryCheck.affectedIndex = index;
        }
    });
    return boundaryCheck;
};

// Properly format to end of date object, otherwise do return date
const formatToEndOfDay = (date) => {
    if (isLooseEndOfDay(date)) return endOfDay(date);
    return date;
};

// Combine neighbouring selections
const mergeNeighbours = (sourceIntervals) => {
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
    const result = eachDayOfInterval({start: weekStart, end: weekEnd}).reduce((acc, day) => {
        return acc || ((!!dates[getMonthIndex(day)] && !!dates[getMonthIndex(day)][day.getDate()]) && isAfter(endBoundary, day));
    }, false);
    return result;
};

function OutingCalendar({ tripId }) {
    const params = useSelector(state => state.planParameters);
    const endDay = new Date(params.dateTimeRange[1]);

    const currentUser = useSelector(state => state.user.selectedUser);
    const users = useSelector(state => state.user.userList);
    const selections = useSelector(state => state.outingSelections);
    const [selectWeek, setSelectWeek] = useState([
        startOfWeek(new Date(params.dateTimeRange[0][0])),
        endOfWeek(new Date(params.dateTimeRange[0][0]))
    ]);
    const [isSelecting, setIsSelecting] = useState(false);
    
    const [isDeciding, setIsDeciding] = useState(false);
    const [isDecidingPreview, setIsDecidingPreview] = useState(null);
    const [decisionAnchor, setDecisionAnchor] = useState(null);
    const [decisionCursor, setDecisionCursor] = useState(null);
    const [decisionPreview, setDecisionPreview] = useState(null);

    const [isAdding, setIsAdding] = useState(true);
    const [editCursor, setEditCursor] = useState(null);
    const [editAnchor, setEditAnchor] = useState(null);
    const [currentSelects, setCurrSelects] = useState(
        !!selections[currentUser]
            ? JSON.parse(JSON.stringify(selections[currentUser]))
            : {}
    );
    const [isEditing, setEditing] = useState(false);
    const [lastMonthUpdate, setMonthUpdate] = useState(null);
    const [firstLoad, setFirstLoad] = useState(false);
    const dispatch = useDispatch();

    let slots = useMemo(() => generateSlots(params), [params]);

    // useEffect(() => {
    //     const controller = new AbortController();
    //     const promiseTrack = [];

    //     dispatch(setLoading(true));
    //     users.forEach((user) => {
    //         eachMonthOfInterval({start: selectWeek[0], end: selectWeek[1]}).forEach((month) => {
    //             const monthIndex = getMonthIndex(month);
    //             const request = axios.get(buildServerRoute('outing', planId, user), {
    //                 // TODO: what information is needed
    //             });
    //             request.then((result) => {
    //                 dispatch(
    //                     // TODO: update user month information
    //                 )
    //             })
    //             .catch(() => {});
    //             promiseTrack.push(request);
    //         });
    //     });

    //     Promise.all(promiseTrack)
    //         .then(() => {
    //             dispatch(setLoading(false));
    //             if (!firstLoad) setFirstLoad(true);
    //         })
    //         .catch((e) => {
    //             if (e.request.status === 0) return;
    //             dispatch(
    //                 setError({
    //                     errType: ERR_TYPE.ERR,
    //                     message:
    //                         'Month information could not be fetched, please try again later. Close this notification to be redirected to the landing page.',
    //                     redirect: '/',
    //                     disableControl: true,
    //                 })
    //             );
    //         });
    //     return () => {
    //         controller.abort();
    //     }
    // }, [selectWeek, tripId, users]);

    const onEnterSegment = (dateTime) => {
        if (isSelecting) setEditCursor(dateTime);
        if (isDeciding) setDecisionCursor(dateTime);
    }

    const toggleEdit = () => {
        if (isEditing) {
            setEditAnchor(null);
            setEditCursor(null);
            setIsSelecting(false);
        }
        setEditing(!isEditing);
        setCurrSelects(JSON.parse(JSON.stringify(selections[currentUser])));
    }

    const confirmEdit = () => {
        dispatch(setUserSelections({user: currentUser, selections: currentSelects}));
        toggleEdit();
    }

    const toggleDecision = () => {
        if (isDeciding) {
            setDecisionAnchor(null);
            setDecisionCursor(null);
            setDecisionPreview(null);
            setIsDeciding(false);
            setIsDecidingPreview(false);
            return;
        }
        setIsDeciding(true);
    }

    const confirmDecision = () => {
        dispatch(setDecisionRange([decisionPreview[0].toISOString(), decisionPreview[1].toISOString()]));
        toggleDecision();
    }

    const onSelectClick = (dateTime, isSelected) => {
        if (isEditing) {
            if (!isSelecting) {
                setIsSelecting(true);
                setIsAdding(!isSelected);
                setEditAnchor(dateTime);
                setEditCursor(getEndOfSegment(dateTime));
            } else {
                const updateCopy = JSON.parse(JSON.stringify(currentSelects));
                if (isAfter(editCursor, editAnchor)) {
                    updateSelections(updateCopy, editAnchor, editCursor, slots, isAdding);
                }
                setCurrSelects(updateCopy);
                setIsSelecting(false);
                setEditAnchor(null);
                setEditCursor(null);
            }
        } else if (isDeciding) {
            if (!isDecidingPreview) {
                setIsDecidingPreview(true);
                setDecisionAnchor(dateTime);
                setDecisionCursor(getEndOfSegment(dateTime));
            } else {
                setIsDecidingPreview(false);
                if (decisionAnchor < decisionCursor) {
                    setDecisionPreview([decisionAnchor, decisionCursor]);
                }
                setDecisionAnchor(null);
                setDecisionCursor(null);
            }
        }
    }

    const nextWeek = [addWeeks(selectWeek[0], 1), addWeeks(selectWeek[1], 1)];
    const prevWeek = [subWeeks(selectWeek[0], 1), subWeeks(selectWeek[1], 1)];
    function changeWeek(type) {
        if (type && checkAnyAvailable(nextWeek[0], nextWeek[1], slots, endDay)) {
            setSelectWeek(nextWeek);
        } else if (!type && checkAnyAvailable(prevWeek[0], prevWeek[1], slots, endDay)) {
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
    }

    const selectsInDay = (date, selections) => {
        const result = {};
        Object.entries(selections).forEach(([user, userSelects]) => {
            result[user] = getDayRanges(date, userSelects);
        });
        return result;
    }

    const inPreviewRange = (anchor, cursor, target) => {
        if (!(anchor && cursor)) return false;
        return anchor <= target && target < cursor;
    }

    const isInSelect = (dateTime) => {
        if (isEditing) return inPreviewRange(editAnchor, editCursor, dateTime);
        if (isDeciding) return inPreviewRange(decisionAnchor, decisionCursor, dateTime);
    }

    return <Card className='outing-card'>
        <Card.Body className="body-content">
            <OutingCalendarLabel dateRange={[selectWeek[0], selectWeek[1]]}
                                 isPrevDisabled={!checkAnyAvailable(prevWeek[0], prevWeek[1], slots, endDay)}
                                 isNextDisabled={!checkAnyAvailable(nextWeek[0], nextWeek[1], slots, endDay)}
                                 onClick={changeWeek}/>
            <div className="calendar-content">
                <div className="day-labels">
                        {eachDayOfInterval({start: selectWeek[0], end: selectWeek[1]}).map((day) => {
                            return <div className="day-label" key={`label-${format(day, 'MMM dd')}`}>{format(day, 'MMM dd')}</div>
                        })}
                    </div>
                <div className="grid-and-labels">
                    <OutingHourLabels />
                    <div className="calendar-grid">
                        {eachDayOfInterval({start: selectWeek[0], end: selectWeek[1]}).map((day, index) => {
                            const editsForDay = currentSelects[getMonthIndex(day)]
                                ? currentSelects[getMonthIndex(day)][day.getDate()]
                                : null;
                            return <div className="day-column" key={`dayCol-${format(day, 'yyyy-MM-dd')}`}>
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
                                    isDeciding={isDeciding}
                                    currentUser={currentUser}
                                    isInSelect={isInSelect}
                                    decisionPreview={decisionPreview}
                                    maxUsers={users.length}
                                />
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <CalendarControls toggleEdit={toggleEdit}
                              confirmEdit={confirmEdit}
                              editing={isEditing}
                              deciding={isDeciding}
                              toggleDecision={toggleDecision}
                              confirmDecisions={confirmDecision} />
        </Card.Body>
    </Card>
}

export default OutingCalendar;
