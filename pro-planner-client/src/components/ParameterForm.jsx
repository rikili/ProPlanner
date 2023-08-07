import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';
import {
    isAfter,
    eachDayOfInterval,
    isEqual,
    addMonths,
    startOfDay,
    endOfDay,
    set,
} from 'date-fns';
import { addDays } from 'date-fns';
import { setError } from '../redux/errorSlice';
import { makeOutingDate } from '../helpers/OutingCalendar';
import { ERR_TYPE, PLAN_TYPE } from '../constants';

import Button from './override/Button';
import InputDetailsForm from '../components/InputDetailsForm';
import TimeRangeForm from '../components/TimeRangeForm';

const MAX_TRIP_MONTH_RANGE = 12;
const MAX_OUTING_MONTH_RANGE = 5;

// Helper functions

// convert format mm-dd-yyyy to date object
const convInputToDate = (dateString) => {
    const dateSegments = dateString.match(/[0-9]+/g).map(Number);
    return new Date(dateSegments[2], dateSegments[0] - 1, dateSegments[1]);
};

// convert hh:mm format to numbers
const convInputToTime = (timeString, isEndTime) => {
    const timeSegments = timeString.match(/[0-9]+/g).map(Number);
    if (isEndTime && !timeSegments[0] && !timeSegments[1]) {
        return { hours: 23, minutes: 59 };
    }
    return { hours: timeSegments[0], minutes: timeSegments[1] };
};

// Parameter details format check
const isProperSubmission = (formData, isOuting) => {
    if (!(formData.name && formData.location)) return false;
    if (isOuting) {
        if (formData.isAllDay) return true;
        return (
            formData.dateTimeRange[0] &&
            formData.dateTimeRange[0][0] &&
            formData.dateTimeRange[0][1] &&
            formData.dateTimeRange[1]
        );
    }
    return true;
};

// Utility function to map values to Infinity when they are above or below zero
const filterTarget = (target, afterTarget) =>
    afterTarget ? (target <= 0 ? target : Infinity) : target >= 0 ? target : Infinity;

// Finds closest valid day of the week relative to the selection range and selected days of the week
const maxDaysInWeek = 7;
const findClosestDOW = (targetDOW, selectedDOWs, afterTarget = false) => {
    return selectedDOWs.map((dayOfWeek) => {
        let prevDiff = filterTarget(dayOfWeek - maxDaysInWeek - targetDOW, afterTarget);
        let normDiff = filterTarget(dayOfWeek - targetDOW, afterTarget);
        let nextDiff = filterTarget(dayOfWeek + maxDaysInWeek - targetDOW, afterTarget);
        return Math.abs(normDiff) < Math.abs(prevDiff)
            ? Math.abs(normDiff) < Math.abs(nextDiff)
                ? normDiff
                : nextDiff
            : Math.abs(prevDiff) < Math.abs(nextDiff)
            ? prevDiff
            : nextDiff;
    });
};

// Utility function to find the smallest magnitude in an array of numbers
const getSmallestDiff = (diffs) => {
    let smallestDiffIndex;
    diffs.reduce((acc, val, index) => {
        if (Math.abs(val) < acc) {
            smallestDiffIndex = index;
            return Math.abs(val);
        }
        return acc;
    }, Infinity);
    return diffs[smallestDiffIndex];
};

// Check if timing boundaries are correctly formed
const isTimingProper = (start, end, endInterval, isOuting = false) => {
    if (isOuting) {
        return (
            isAfter(endInterval, start) && (isAfter(end, endInterval) || isEqual(end, endInterval))
        );
    } else {
        return isAfter(end, start) || isEqual(start, end);
    }
};

// Transforms startDate and endDate to conform to their nearest valid day
const roundBoundaryDays = (startDate, endDate, selectedDOWs) => {
    const startDiffs = findClosestDOW(startDate.getDay(), selectedDOWs);
    const startOffset = getSmallestDiff(startDiffs);
    const endDiffs = findClosestDOW(endDate.getDay(), selectedDOWs, true);
    const endOffset = endDiffs.find((diff) => diff === 0) ? 0 : Math.max(...endDiffs);

    return [addDays(startDate, startOffset), addDays(endDate, endOffset)];
};

// Determines if there are valid days within the selected date range and selected days of week
const areValidSlots = (start, end, daysOfWeek) =>
    eachDayOfInterval({ start, end }).reduce(
        (acc, day) => acc || daysOfWeek.includes(day.getDay()),
        false
    );

const reformatDateString = (inpString) => {
    if (!inpString) return null;
    const splits = inpString.match(/[0-9]+/g);
    return `${splits[1]}-${splits[2]}-${splits[0]}`;
};

const formatSelectedDays = (selectedDays) => {
    const result = [];
    Object.entries(selectedDays).forEach(([_, isSelected], index) => {
        if (isSelected) {
            result.push(index);
        }
    });
    return result;
};

// Component
/*
    Form component to intake plan parameter details

    Props:
        title: a string/element/component to display as title of form card
        onSubmit: callback function to be fed completed form details
        editDetails: if defined, defines component to be in edit mode. All fields should be defined to
                       be used for placeholding the fields in the form
*/
const ParameterForm = ({ title, onSubmit, editDetails = null, showBack = false }) => {
    const [validated, setValidated] = useState(false);
    const isOuting = useSelector((state) => state.planParameters.planType) === PLAN_TYPE.OUTING;
    const dispatch = useDispatch();

    // callback function to handle form submission
    const handleFormSubmission = async (e) => {
        e.preventDefault();
        setValidated(true);

        const formVals = (key) => (e.target.elements[key] ? e.target.elements[key].value : null);
        const detailResults = {
            name: formVals('planName'),
            location: formVals('planLocation'),
            budget: formVals('planBudget'),
            description: formVals('planDescription'),
            dateRange: [
                reformatDateString(formVals('planStartDate')),
                reformatDateString(formVals('planEndDate')),
            ],
            selectedDaysOfWeek: formatSelectedDays(JSON.parse(formVals('planDOWs'))),
        };

        let timeResults = null;
        if (isOuting) {
            timeResults = {
                isAllDay: !!formVals('planIsAllDay'),
                timeRange: [formVals('planTimeStart'), formVals('planTimeEnd')],
            };
        }

        let formResult = {
            name: detailResults.name,
            location: detailResults.location,
            budget: detailResults.budget,
            description: detailResults.description,
            dateTimeRange: [],
            dayOffset: [],
        };

        if (!formResult.name) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Name is missing. Please enter a name.',
                })
            );
            return;
        }

        if (!formResult.location) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Location is missing. Please enter a location.',
                })
            );
            return;
        }

        if (formResult.budget < 0) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Budget cannot be negative or missing. Please try again.',
                })
            );
            return;
        }

        if (!detailResults.dateRange[0]) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Start date is missing. Please provide a date.',
                })
            );
            return;
        }

        if (!detailResults.dateRange[1]) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'End date is missing. Please provide a date.',
                })
            );
            return;
        }

        const convStart = convInputToDate(detailResults.dateRange[0]);
        const convEnd = convInputToDate(detailResults.dateRange[1]);

        if (!isTimingProper(convStart, convEnd)) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message:
                        'Dates inputs are invalid, start date must be before or the same as the end date.',
                })
            );
            return;
        }

        if (
            addMonths(convStart, isOuting ? MAX_OUTING_MONTH_RANGE : MAX_TRIP_MONTH_RANGE) < convEnd
        ) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: isOuting
                        ? 'Dates inputs are invalid, Outing plans can have a max of only a 5 month difference between start and end.'
                        : 'Dates inputs are invalid, Trip plans can have a max of only a one year difference between start and end.',
                })
            );
            return;
        }

        if (!detailResults.selectedDaysOfWeek.length) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'At least one day of the week must be selected.',
                })
            );
            return;
        }

        if (!areValidSlots(convStart, convEnd, detailResults.selectedDaysOfWeek)) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message:
                        "Dates and days of the week configuration doesn't contain any available slots.",
                })
            );
            return;
        }

        const [roundedStart, roundedEnd] = roundBoundaryDays(
            convStart,
            convEnd,
            detailResults.selectedDaysOfWeek
        );

        let startDateTime;
        if (isOuting) {
            let startEndTime;
            let endDate;

            if (timeResults.isAllDay) {
                startDateTime = startOfDay(roundedStart);
                startEndTime = endOfDay(roundedStart);
                endDate = endOfDay(roundedEnd);
            } else {
                const startTime = convInputToTime(timeResults.timeRange[0]);
                const endTime = convInputToTime(timeResults.timeRange[1], true);

                startDateTime = set(roundedStart, {
                    hours: startTime.hours,
                    minutes: startTime.minutes,
                });
                startEndTime = set(roundedStart, {
                    hours: endTime.hours,
                    minutes: endTime.minutes,
                });
                endDate = set(roundedEnd, { hours: endTime.hours, minutes: endTime.minutes });
            }

            if (!isTimingProper(startDateTime, endDate, startEndTime, true)) {
                dispatch(
                    setError({
                        errType: ERR_TYPE.ERR,
                        message: 'Timing inputs are invalid, start times must be before end times.',
                    })
                );
                return;
            }

            formResult.isAllDay = false;
            formResult.dateTimeRange = [
                [makeOutingDate(startDateTime), makeOutingDate(startEndTime)],
                makeOutingDate(endDate),
            ];
        } else {
            startDateTime = startOfDay(roundedStart);
            const endDate = endOfDay(roundedEnd);

            formResult.dateTimeRange = [startDateTime.toISOString(), endDate.toISOString()];
        }

        const selectedDays = detailResults.selectedDaysOfWeek;
        const maxDaysOfWeek = 7;

        if (selectedDays.length === 1) {
            formResult.dayOffset.push(maxDaysOfWeek);
        } else {
            const startDayOfWeek = startDateTime.getDay();
            let closestIndex;
            selectedDays
                .map((dayOfWeek) => {
                    const normalDiff = Math.abs(startDayOfWeek - dayOfWeek);
                    const wrapDiff = Math.abs(dayOfWeek - (startDayOfWeek + maxDaysOfWeek));
                    return normalDiff < wrapDiff ? normalDiff : wrapDiff;
                })
                .reduce((acc, difference, index) => {
                    if (difference < acc) {
                        closestIndex = index;
                        return difference;
                    }
                    return acc;
                }, Infinity);

            let iterIndex = closestIndex;
            const endIndex = iterIndex;
            let hasWrapped = false;

            let iterDOW = selectedDays[iterIndex];
            let prevDOW;
            do {
                prevDOW = iterDOW;
                iterIndex++;
                if (iterIndex >= selectedDays.length) {
                    iterIndex = 0;
                    hasWrapped = true;
                }
                iterDOW = selectedDays[iterIndex] + (hasWrapped ? maxDaysOfWeek : 0);
                formResult.dayOffset.push(iterDOW - prevDOW);
            } while (iterIndex !== endIndex);
        }

        if (!isProperSubmission(formResult, isOuting)) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Required fields are missing. Please ensure all fields are selected.',
                })
            );
            return;
        }
        onSubmit(formResult, isOuting ? PLAN_TYPE.OUTING : PLAN_TYPE.TRIP);
    };

    return (
        <Form
            className="mx-auto d-flex flex-column gap-3 pt-3 p-2"
            style={{ maxWidth: '900px' }}
            onSubmit={handleFormSubmission}
            noValidate
            validated={validated}>
            <InputDetailsForm
                title={title}
                editDetails={editDetails}
                showBack={showBack}
                isOuting={isOuting}
            />
            {isOuting && <TimeRangeForm editDetails={editDetails} />}
            <div className="text-center">
                <Button className="w-50 mb-3" variant="custom-success" size="md" type="submit">
                    <b>Submit</b>
                </Button>
            </div>
        </Form>
    );
};

export default ParameterForm;
