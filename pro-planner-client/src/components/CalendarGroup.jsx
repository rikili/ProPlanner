import { useState } from 'react';
import UserSideBar from './UserSideBar';
import SummaryList from "./SummaryList";
import DecisionInfo from "./DecisionInfo";
import './CalendarGroup.scss';

const CalendarGroup = ({ renderCalendar }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    return <div className='group-wrapper'>
        <div className='group-content'>
            <UserSideBar
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />
            {renderCalendar(selectedUser)}
            <div className='details-stack'>
                <DecisionInfo />
                <SummaryList />
            </div>
        </div>
    </div>
};

export default CalendarGroup;
