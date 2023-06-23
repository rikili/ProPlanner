import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { isAfter } from 'date-fns';

import InputDetailsForm from '../components/InputDetailsForm';
import TimeRangeForm from '../components/TimeRangeForm';
import { updatePlan } from '../redux/planParamSlice';
import { setError, resetError } from '../redux/errorSlice';
import { ERR_TYPE, PLAN_TYPE  } from '../constants';

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

const isTimingProper = (start, end, endInterval, isOuting = false) => {
    if (isOuting) {
        return isAfter(endInterval, start)
            && isAfter(end, endInterval);
    } else {
        return isAfter(end, start);
    }
}

const PlanCreator = ({ title = <>Setup the <b>Plan</b></> }) => { 
    //TODO: currently title is customizable, may want to consider removing
    //      if creator isn't re-used (ie. if we use this comp for editing)

    // const { tripId } = useParams(); //Access for tripId
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
            availableDays: detailResults.availableDays,
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

        const testStart = new Date(detailResults.dateRange[0]);
        const testEnd = new Date(detailResults.dateRange[1]);

        if (!isTimingProper(testStart, testEnd)) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Dates inputs are invalid, start dates must be before end dates.',
            }));
            return;
        }

        if (!formResult.availableDays.length) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'At least one day of the week must be selected.'
            }));
            return;
        }

        const timeResults = isOuting ? timeForm.current.retrieveData() : null;
        if (isOuting && !timeResults.isAllDay) {
            const startDateTime = new Date(`${detailResults.dateRange[0]}, ${timeResults.timeRange[0]}`);
            const endTime = new Date(`${detailResults.dateRange[0]}, ${timeResults.timeRange[1]}`);
            const endDate = new Date(`${detailResults.dateRange[1]}, ${timeResults.timeRange[1]}`);

            if (!isTimingProper(startDateTime, endDate, endTime, true)) {
                dispatch(setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Timing inputs are invalid, start times must be before end times.',
                }));
                return;
            }

            formResult.isAllDay = false;
            formResult.dateTimeRange =  [[startDateTime.toISOString(), endTime.toISOString()], endDate.toISOString()];
        } else {
            const startDateTime = new Date(`${detailResults.dateRange[0]}, 00:00:00`);
            const endDate = new Date(`${detailResults.dateRange[1]}, 23:59:59`);

            formResult.dateTimeRange = [startDateTime.toISOString(), endDate.toISOString()];
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
