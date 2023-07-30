import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import OutingCalendar from '../components/OutingCalendar';
import TripCalendar from "../components/TripCalendar";
import CalendarGroup from "../components/CalendarGroup";
import { PLAN_TYPE } from '../constants';

const SchedulePage = () => {
    const tripId = useLocation().pathname.slice(1);
    const planParams = useSelector(state => state.planParameters);

    const renderCalendar = (selectedUser) => (planParams.planType === PLAN_TYPE.OUTING)
        ? (<OutingCalendar tripId={tripId} selectedUser={selectedUser} />)
        : (<TripCalendar tripId={tripId} selectedUser={selectedUser} />);


    return <CalendarGroup renderCalendar={renderCalendar}/>
};

export default SchedulePage;
