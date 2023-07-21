import TripCalendar from "./TripCalendar";
import TripDetailList from "./TripDetailList";

import './TripGroup.scss';

const TripGroup = ({ tripId }) => {
    return <div className='group-wrapper'>
        <div className='trip-content'>
            <TripCalendar tripId={tripId} />
            <TripDetailList />
        </div>
    </div>
};

export default TripGroup;
