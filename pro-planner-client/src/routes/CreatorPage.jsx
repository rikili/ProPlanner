import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { isAfter, eachDayOfInterval, isEqual } from 'date-fns';
import { START_DAY_TIME, END_DAY_TIME } from '../constants';
import { addDays, format } from 'date-fns';

import InputDetailsForm from '../components/InputDetailsForm';
import TimeRangeForm from '../components/TimeRangeForm';
import { updatePlan } from '../redux/planParamSlice';
import { setError, resetError } from '../redux/errorSlice';
import { ERR_TYPE, PLAN_TYPE } from '../constants';

const isProperSubmission = (formData, isOuting) => {
    if (!(formData.name && formData.location)) return false;
    if (isOuting) {
        if (formData.isAllDay) return true;
        return (formData.dateTimeRange[0]
            && formData.dateTimeRange[0][0]
            && formData.dateTimeRange[0][1]
            && formData.dateTimeRange[1]
        );
    }
    return true;
}

const filterTarget = (target, afterTarget) =>
    afterTarget
        ? target <= 0
            ? target
            : Infinity
        : target >= 0
            ? target
            : Infinity;

const maxDaysInWeek = 7;
const findClosestDOW = (targetDOW, selectedDOWs, afterTarget = false) => {
    return selectedDOWs.map((dayOfWeek) => {
        let prevDiff = filterTarget(
            dayOfWeek - maxDaysInWeek - targetDOW,
            afterTarget
        );
        let normDiff = filterTarget(dayOfWeek - targetDOW, afterTarget);
        let nextDiff = filterTarget(
            dayOfWeek + maxDaysInWeek - targetDOW,
            afterTarget
        );
        return Math.abs(normDiff) < Math.abs(prevDiff)
            ? Math.abs(normDiff) < Math.abs(nextDiff)
                ? normDiff
                : nextDiff
            : Math.abs(prevDiff) < Math.abs(nextDiff)
                ? prevDiff
                : nextDiff;
    });
};

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

const isTimingProper = (start, end, endInterval, isOuting = false) => {
    if (isOuting) {
        return isAfter(endInterval, start)
            && (isAfter(end, endInterval) || isEqual(end, endInterval));
    } else {
        return isAfter(end, start) || isEqual(start, end);
    }
}

const roundBoundaryDays = (startDate, endDate, selectedDOWs) => {
    const startDiffs = findClosestDOW(startDate.getDay(), selectedDOWs);
    const startOffset = getSmallestDiff(startDiffs);
    const endDiffs = findClosestDOW(endDate.getDay(), selectedDOWs, true);
    const endOffset = endDiffs.find((diff) => diff === 0) ? 0 : Math.max(...endDiffs);

    return [addDays(startDate, startOffset), addDays(endDate, endOffset)];
}

const areValidSlots = (start, end, daysOfWeek) => eachDayOfInterval({start, end})
    .reduce((acc, day) => acc || daysOfWeek.includes(day.getDay()), false);

const PlanCreator = ({ title = <><b>Plan Setup</b></> }) => {
    //TODO: currently title is customizable, may want to consider removing
    //      if creator isn't re-used (ie. if we use this comp for editing)
    const tripId = 123;

    const detailForm = useRef(null);
    const timeForm = useRef(null);
    const isOuting = useSelector(state => state.planParameters.planType) === PLAN_TYPE.OUTING;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFormSubmission = () => {
        const detailResults = detailForm.current.retrieveData();
        let formResult = {
            name: detailResults.name,
            location: detailResults.location,
            isAllDay: true,
            dateTimeRange: [],
            dayOffset: [],
        };

        if (!formResult.name) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Name is missing. Please enter a name.',
            }));
            return;
        }

        if (!formResult.location) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Location is missing. Please enter a location.',
            }));
            return;
        }

        const convStart = new Date(detailResults.dateRange[0]);
        const convEnd = new Date(detailResults.dateRange[1]);

        if (!isTimingProper(convStart, convEnd)) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Dates inputs are invalid, start date must be before end date.',
            }));
            return;
        }

        if (!detailResults.selectedDaysOfWeek.length) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'At least one day of the week must be selected.'
            }));
            return;
        }

        if (!areValidSlots(convStart, convEnd, detailResults.selectedDaysOfWeek)) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Dates and days of the week configuration doesn\'t contain any available slots.',
            }));
            return;
        }
        
        const [roundedStart, roundedEnd] = roundBoundaryDays(
            convStart,
            convEnd,
            detailResults.selectedDaysOfWeek,
        );

        const startString = format(roundedStart, 'MM-dd-yyyy');
        const endString = format(roundedEnd, 'MM-dd-yyyy');

        const timeResults = isOuting ? timeForm.current.retrieveData() : null;
        let startDateTime;
        if (isOuting) {
            let startTime;
            let endTime;
            if (timeResults.isAllDay) {
                startTime = START_DAY_TIME;
                endTime = END_DAY_TIME;
            } else {
                startTime = timeResults.timeRange[0];
                endTime = timeResults.timeRange[1];
            }
            startDateTime = new Date(`${startString}, ${startTime}`);
            const startEndTime = new Date(`${startString}, ${endTime}`);
            const endDate = new Date(`${endString}, ${endTime}`);

            if (!isTimingProper(startDateTime, endDate, startEndTime, true)) {
                dispatch(setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Timing inputs are invalid, start times must be before end times.',
                }));
                return;
            }

            formResult.isAllDay = false;
            formResult.dateTimeRange = [[startDateTime.toISOString(), startEndTime.toISOString()], endDate.toISOString()];
        } else {
            startDateTime = new Date(`${startString}, ${START_DAY_TIME}`);
            const endDate = new Date(`${endString}, ${END_DAY_TIME}`);

            formResult.dateTimeRange = [startDateTime.toISOString(), endDate.toISOString()];
        }

        const selectedDays = detailResults.selectedDaysOfWeek;
        const maxDaysOfWeek = 7;

        if (selectedDays.length === 1) {
            formResult.dayOffset.push(maxDaysOfWeek);
        } else {
            const startDayOfWeek = startDateTime.getDay();
            let closestIndex;
            selectedDays.map((dayOfWeek) => {
                const normalDiff = Math.abs(startDayOfWeek - dayOfWeek);
                const wrapDiff = Math.abs(dayOfWeek - (startDayOfWeek + maxDaysOfWeek));
                return normalDiff < wrapDiff ? normalDiff : wrapDiff;
            }).reduce((acc, difference, index) => {
                if (difference < acc) {
                    closestIndex = index;
                    return difference;
                }
                return acc
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
                formResult.dayOffset.push(
                    iterDOW - prevDOW
                );
            } while (iterIndex !== endIndex);
        }

        if (!isProperSubmission(formResult, isOuting)) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Required fields are missing. Please ensure all fields are selected.',
            }));
            return;
        }

        dispatch(updatePlan(formResult));
        dispatch(resetError());
        navigate(`/user/${tripId}`); // TODO: ID should be generated on confirm -- get from backend
    }

    return <div className="w-50 mx-auto mt-5">
        <InputDetailsForm ref={detailForm} title={title} />
        {isOuting && <TimeRangeForm ref={timeForm} />}
        <div className="text-center m-3">
            <Button className="w-50" variant="success" size="md" onClick={handleFormSubmission}>
                <b>Submit</b>
            </Button>
        </div>
    </div>
}

export default PlanCreator;
