import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './SummaryList.scss';

const SummaryList = () => {
    const selectedList = useSelector((state) => state.summary.detailedUsers);
    const isDetailSelected = useSelector((state) => state.summary.detailedDay);
    const userList = useSelector((state) => state.user.userList);

    return (
        <Card className="details-card summary-list">
            <Card.Header className="summary-body"><b>Users Selected</b></Card.Header>
            <Card.Body className="summary-body">
                <div className="trip-summary-list text-center">
                    {!!isDetailSelected ? (
                        <>
                            {selectedList.toSorted().map((user, index) => {
                                return (
                                    <div
                                        key={`user-selected-summary-${index}`}
                                        className="trip-summary-label trip-summary-selected"
                                    >
                                        {user}
                                    </div>
                                );
                            })}
                            {userList.toSorted()
                                .filter((user) => !selectedList.includes(user))
                                .map((user, index) => {
                                    return (
                                        <div key={`user-summary-${index}`} className="trip-summary-label">
                                            {user}
                                        </div>
                                    );
                                })}
                        </>
                    ) : (
                        <p className="trip-summary-instruct">Click a segment to view selections for that section.</p>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default SummaryList;
