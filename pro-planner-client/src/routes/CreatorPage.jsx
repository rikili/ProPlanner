import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setIsUploading, updatePlan, setCodeReadyToCopy } from '../redux/planParamSlice';
import { useEffect } from 'react';
import { resetError } from '../redux/errorSlice';
import { buildServerRoute } from '../helpers/Utils';
import { useNavigate } from 'react-router-dom';
import LoadingDisplay from '../components/LoadingDisplay';
import ParameterForm from '../components/ParameterForm';

const CreatorPage = () => {
    const isUploading = useSelector((state) => state.planParameters.isUploading);
    const planType = useSelector((state) => state.planParameters.planType);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!planType) {
            navigate('/');
        }
    }, []);

    const handleSubmit = (formResult, planType) => {
        axios
            .post(buildServerRoute(planType), formResult)
            .then((result) => {
                const { id, planParameters } = result.data;
                dispatch(updatePlan(planParameters));
                dispatch(setIsUploading(false));
                dispatch(resetError());
                navigate(`/user/${id}`);
            })
            .catch((err) => {
                console.log(err);
                dispatch(setIsUploading(false));
            });
        dispatch(setIsUploading(true));
        dispatch(setCodeReadyToCopy(true));
    };

    return (
        <>
            {isUploading ? (
                <LoadingDisplay />
            ) : (
                <ParameterForm title="Plan Setup" onSubmit={handleSubmit} showBack />
            )}
        </>
    );
};

export default CreatorPage;
