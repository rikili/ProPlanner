import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { PLAN_TYPE } from '../constants';
import OutingCalendar from '../components/OutingCalendar';
import TripCalendar from '../components/TripCalendar';
import CalendarGroup from '../components/CalendarGroup';

const SchedulePage = () => {
    const { tripId } = useParams();

    const planParams = useSelector((state) => state.planParameters);

    const renderCalendar = (selectedUser, setIsEditMode, isEditMode) =>
        planParams.planType === PLAN_TYPE.OUTING ? (
            <OutingCalendar
                planId={tripId}
                selectedUser={selectedUser}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
            />
        ) : (
            <TripCalendar
                planId={tripId}
                selectedUser={selectedUser}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
            />
        );

    return <CalendarGroup renderCalendar={renderCalendar} />;
};

export default SchedulePage;
