import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './TripDetailList.scss';

const TripDetailList = () => {
    const selectedList = useSelector((state) => state.tripSelections.detailUsers);
    const isDetailSelected = useSelector((state) => state.tripSelections.detailedDay);
    const userList = useSelector((state) => state.user.userList);

    return (
        <Card>
            <Card.Body className="trip-detail-card">
                <b>Users Selected</b>
                <div className="trip-detail-list">
                    {!!isDetailSelected ? (
                        <>
                            {selectedList.map((user, index) => {
                                return (
                                    <div
                                        key={`user-selected-detail-${index}`}
                                        className="trip-detail-label trip-detail-selected"
                                    >
                                        {user}
                                    </div>
                                );
                            })}
                            {userList
                                .filter((user) => !selectedList.includes(user))
                                .map((user, index) => {
                                    return (
                                        <div key={`user-detail-${index}`} className="trip-detail-label">
                                            {user}
                                        </div>
                                    );
                                })}
                        </>
                    ) : (
                        <p className="trip-detail-instruct">Click a segment to view selections for that section.</p>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default TripDetailList;
