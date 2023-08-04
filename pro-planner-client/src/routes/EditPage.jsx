import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buildServerRoute } from '../helpers/Utils';
import { setError } from '../redux/errorSlice';
import { ERR_TYPE } from '../constants';
import { updatePlan } from '../redux/planParamSlice';
import axios from 'axios';
import LoadingDisplay from '../components/LoadingDisplay';
import ParameterForm from '../components/ParameterForm';

const EditPage = () => {
    const [isUploading, setIsUploading] = useState(false);
    const { tripId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const params = useSelector((state) => state.planParameters);

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
        axios
            .put(buildServerRoute('plan', tripId), { ...formResult, planType })
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
                <ParameterForm title={'Editing Plan..'} onSubmit={handleSubmission} editDetails={existingData} />
            ) : (
                <LoadingDisplay />
            )}
        </>
    );
};

export default EditPage;
