import { useState } from 'react';
import TripCalendar from './TripCalendar';
import TripSummaryList from './TripSummaryList';

import TripDecisionInfo from './TripDecisionInfo';
import UserSideBar from './UserSideBar';
import './TripGroup.scss';

const TripGroup = ({ tripId }) => {
	//defining these states in the parent so they can be passed down to UserSideBar and TripCalendar respectively.
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	return (
		<div className="group-wrapper">
			<div className="trip-content">
				<UserSideBar
					tripId={tripId}
					isEditMode={isEditMode}
					setIsEditMode={setIsEditMode}
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
				/>
				<TripCalendar
					tripId={tripId}
					isEditMode={isEditMode}
					setIsEditMode={setIsEditMode}
					selectedUser={selectedUser}
				/>
				<div className="details-stack">
					<TripDecisionInfo />
					<TripSummaryList />
				</div>
			</div>
		</div>
	);
};

export default TripGroup;
