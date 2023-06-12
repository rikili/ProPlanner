import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import WeeklyCalendar from '../components/WeeklyCalandar';
import { PLAN_TYPE } from '../constants';

const SchedulePage = () => {
    const planParams = useSelector(state => state.planParameters);
    const navigate = useNavigate();

    useEffect(() => {
        if (!planParams.name) {
            alert('Invalid plan details. Redirecting to start of plan creation.');
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
