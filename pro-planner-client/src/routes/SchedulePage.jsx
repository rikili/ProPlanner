import { Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router";

import OutingCalendar from '../components/OutingCalendar';
import TripCalendar from "../components/TripCalendar";
import { PLAN_TYPE } from '../constants';
import LoadingDisplay from "../components/LoadingDisplay";

const SchedulePage = () => {
    const tripId = useLocation().pathname.slice(1);
    const planParams = useSelector(state => state.planParameters);

    return <div>
        {(planParams.planType === PLAN_TYPE.OUTING)
            ? <OutingCalendar tripId={tripId} />
            : <TripCalendar tripId={tripId} />
        }
    </div>
};

export default SchedulePage;
