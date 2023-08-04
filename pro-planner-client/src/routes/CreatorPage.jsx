import { useDispatch, useSelector } from "react-redux";
import ParameterForm from "../components/ParameterForm"
import axios from "axios";
import { setIsUploading, updatePlan } from '../redux/planParamSlice';
import { resetError } from '../redux/errorSlice';
import { buildServerRoute } from "../helpers/Utils";
import { useNavigate } from "react-router-dom";
import LoadingDisplay from "../components/LoadingDisplay";

const CreatorPage = () => {
    const isUploading = useSelector(state => state.planParameters.isUploading);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (formResult, planType) => {
        axios.post(buildServerRoute(planType), formResult)
            .then((result) => {
                const {id, planParameters} = result.data;
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
    }

    return <>
        {isUploading
            ? <LoadingDisplay />
            : <ParameterForm title="Plan Setup" onSubmit={handleSubmit} showBack />
        }
    </>
}

export default CreatorPage;
