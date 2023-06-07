import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';

import InputDetailsForm from './InputDetailsForm';
import TimeRangeForm from './TimeRangeForm';
import { updatePlan, PLAN_TYPE } from '../redux/planParamSlice';

const PlanCreator = ({ title = <>Setup the <b>Plan</b></> }) => { 
    //TODO: currently title is customizable, may want to consider removing
    //      if creator isn't re-used (ie. if we use this comp for editing)
    const detailForm = useRef(null);
    const timeForm = useRef(null);
    const isOuting = useSelector(state => state.planParameters.planType) === PLAN_TYPE.OUTING;
    const dispatch = useDispatch();

    const handleFormSubmission = () => {
        const detailResults = detailForm.current.retrieveData();
        let formResult = {
            name: detailResults.name,
            location: detailResults.location,
            isAllDay: true,
            dateTimeRange: [],
            availableDays: detailResults.availableDays,
        };

        const timeResults = isOuting ? timeForm.current.retrieveData() : null;
        if (isOuting && !timeResults.isAllDay) {
            const startDateTime = new Date(`${detailResults.dateRange[0]}, ${timeResults.timeRange[0]}`).toISOString();
            const endTime = new Date(`${detailResults.dateRange[0]}, ${timeResults.timeRange[1]}`).toISOString();
            const endDate = new Date(`${detailResults.dateRange[1]}, ${timeResults.timeRange[1]}`).toISOString();

            console.log(timeResults.timeRange[1]);

            formResult.isAllDay = false;
            formResult.dateTimeRange =  [[startDateTime, endTime], endDate];
        } else {
            const startDateTime = new Date(`${detailResults.dateRange[0]}, 00:00:00`).toISOString();
            const endDate = new Date(`${detailResults.dateRange[1]}, 23:59:59`).toISOString();
            formResult.dateTimeRange = [startDateTime, endDate];
        }
        
        dispatch(updatePlan(formResult));
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
