import { useState } from 'react';
import UserSideBar from './UserSideBar';
import SummaryList from "./SummaryList";
import DecisionInfo from "./DecisionInfo";
import './CalendarGroup.scss';

const CalendarGroup = ({ children }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    return <div className='group-wrapper'>
        <div className='trip-content'>
            <UserSideBar
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />
            {children}
            <div className='details-stack'>
                <DecisionInfo />
                <SummaryList />
            </div>
        </div>
    </div>
};

export default CalendarGroup;
