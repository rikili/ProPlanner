import axios from 'axios';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buildServerRoute } from '../helpers/Utils';
import { setError } from '../redux/errorSlice';
import { ERR_TYPE, PLAN_TYPE } from '../constants';
import { updatePlan } from '../redux/planParamSlice';
import { isAfter, isBefore } from 'date-fns';
import LoadingDisplay from '../components/LoadingDisplay';
import ParameterForm from '../components/ParameterForm';

const EditPage = () => {
    const [isUploading, setIsUploading] = useState(false);
    const { tripId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const decision = useSelector((state) => state.planParameters.decisionRange);
    const params = useSelector((state) => state.planParameters);

    const checkDecisionInRange = (dateRange, planType) => {
        if (!decision.length) return false;
        const startTime = planType === PLAN_TYPE.OUTING ? dateRange[0][0] : dateRange[0];
        const endTime = dateRange[1];
        return (
            isBefore(new Date(decision[0]), new Date(startTime)) ||
            isAfter(new Date(decision[1]), new Date(endTime))
        );
    };

    const existingData = {
        name: params.name,
        dateTimeRange: params.dateTimeRange,
        dayOffset: params.dayOffset,
        isAllDay: params.isAllDay,
        location: params.location,
        budget: params.budget,
        planType: params.planType,
        description: params.description,
    };

    const handleSubmission = (formResult, planType) => {
        let shouldClearDecision = false;
        if (checkDecisionInRange(formResult.dateTimeRange, planType)) {
            shouldClearDecision = true;
        }

        axios
            .put(buildServerRoute('plan', tripId), {
                ...formResult,
                planType,
                decision: shouldClearDecision ? [] : decision,
            })
            .then((result) => {
                dispatch(updatePlan(result.data));
                setIsUploading(false);
                navigate('..');
            })
            .catch((e) => {
                setIsUploading(false);
                dispatch(
                    setError({
                        errType: ERR_TYPE.ERR,
                        message: 'Update to plan has failed. Please try again later.',
                    })
                );
            });
        setIsUploading(true);
    };

    return (
        <>
            {!isUploading ? (
                <ParameterForm
                    title={'Editing Plan..'}
                    onSubmit={handleSubmission}
                    editDetails={existingData}
                />
            ) : (
                <LoadingDisplay />
            )}
        </>
    );
};

export default EditPage;
