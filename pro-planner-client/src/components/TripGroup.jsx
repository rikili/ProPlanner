import TripCalendar from "./TripCalendar";
import TripSummaryList from "./TripSummaryList";

import TripDecisionInfo from "./TripDecisionInfo";
import './TripGroup.scss';

const TripGroup = ({ tripId }) => {
    return <div className='group-wrapper'>
        <div className='trip-content'>
            <TripCalendar tripId={tripId} />
            <div className='details-stack'>
                <TripDecisionInfo />
                <TripSummaryList />
            </div>
        </div>
    </div>
};

export default TripGroup;
