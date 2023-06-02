import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';

import InputDetailsForm from './InputDetailsForm';
import TimeRangeForm from './TimeRangeForm';
import { updatePlan } from '../redux/planParamSlice';

const PlanCreator = ({ title = <>Setup the <b>Plan</b></> }) => { 
    //TODO: currently title is customizable, may want to consider removing
    //      if creator isn't re-used (ie. if we use this comp for editing)
    const detailForm = useRef(null);
    const timeForm = useRef(null);
    const showTimeForm = useSelector(state => state.planParameters.planType) === 'Outing';
    const dispatch = useDispatch();

    const handleFormSubmission = () => {
        const detailResults = detailForm.current.retrieveData();
        const timeResults = timeForm.current ? timeForm.current.retrieveData() : null;
        console.log({...detailResults, ...timeResults});
        if (timeResults) dispatch(updatePlan({...detailResults, isAllDay: true}));
        else dispatch(updatePlan({...detailResults, ...timeResults}));
    }

    return <div className="w-50 mx-auto mt-5">
        <InputDetailsForm ref={detailForm} title={title} />
        {showTimeForm && <TimeRangeForm ref={timeForm} />}
        <div className="text-center m-3">
            <Button className="w-50" variant="success" size="md" onClick={handleFormSubmission}>
                <b>Submit</b>
            </Button>
        </div>
    </div>
}

export default PlanCreator;
