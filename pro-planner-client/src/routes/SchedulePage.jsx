import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import OutingCalendar from '../components/OutingCalendar';
import TripCalendar from '../components/TripCalendar';
import CalendarGroup from '../components/CalendarGroup';
import { PLAN_TYPE } from '../constants';

const SchedulePage = () => {
    const planId = useLocation().pathname.slice(1);
    const planParams = useSelector((state) => state.planParameters);

    const renderCalendar = (selectedUser, setIsEditMode, isEditMode) =>
        planParams.planType === PLAN_TYPE.OUTING ? (
            <OutingCalendar planId={planId} />
        ) : (
            <TripCalendar
                planId={planId}
                selectedUser={selectedUser}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
            />
        );

    return <CalendarGroup renderCalendar={renderCalendar} />;
};

export default SchedulePage;
