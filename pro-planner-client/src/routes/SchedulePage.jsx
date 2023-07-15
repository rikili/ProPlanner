import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import OutingCalendar from '../components/OutingCalendar';
import TripCalendar from "../components/TripCalendar";
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
                message: 'Information of this plan is invalid, malformed, or missing. Close this notification to be redirected to the landing page.',
                redirect: '/',
                disableControl: true
            }));
        }
    }, [planParams, navigate, dispatch]);

    return <div>
        {planParams.name && (planParams.planType === PLAN_TYPE.OUTING)
        ? <OutingCalendar />
        : <TripCalendar />}
    </div>
};

export default SchedulePage;
