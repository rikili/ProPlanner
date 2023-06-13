import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import WeeklyCalendar from '../components/WeeklyCalandar';
import { ERR_TYPE, PLAN_TYPE } from '../constants';
import { setError } from "../redux/errorSlice";

const SchedulePage = () => {
    const planParams = useSelector(state => state.planParameters);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!planParams.name) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Information of this plan is invalid, malformed, or missing. Redirecting to the landing page.'
            }));
            navigate('/');
        }
    }, [planParams, navigate]);

    return <div>
        {planParams.name && (planParams.planType === PLAN_TYPE.OUTING)
        ? <WeeklyCalendar />
        : <div/>}
    </div>
};

export default SchedulePage;
