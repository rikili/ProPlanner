import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { isFirstHalf } from '../helpers/TripCalendar';
import { setDecisionRange } from '../redux/planParamSlice';
import './TripDecisionInfo.scss';

const halfFlair = (date) => {
    return isFirstHalf(date) ? '(Morning)' : '(Evening)';
};

const TripDecisionInfo = () => {
    const decisionRange = useSelector((state) => state.planParameters.decisionRange);
    const dispatch = useDispatch();
    const rangeSelected = !!decisionRange.length;

    const rangeStart = new Date(decisionRange[0]);
    const rangeEnd = new Date(decisionRange[1]);

    const handleClear = () => {
        dispatch(setDecisionRange([]));
    };

    return (
        <Card className="details-card">
            <Card.Header className="decision-body">
                <b>Trip Decision</b>
            </Card.Header>
            <Card.Body className="decision-body">
                <div className="decision-content">
                    {rangeSelected ? (
                        <div className="decision-range">
                            <span>{halfFlair(rangeStart)}</span>
                            <span>{format(rangeStart, 'MMMM dd, yyyy')}</span>
                            <span style={{ color: 'black' }}>To</span>
                            <span>{halfFlair(rangeEnd)}</span>
                            <span>{format(rangeEnd, 'MMMM dd, yyyy')}</span>
                        </div>
                    ) : (
                        <p className="trip-decision-instruct">This plan currently doesn't have a decision made.</p>
                    )}
                </div>
            </Card.Body>
            {rangeSelected && (
                <Card.Footer className="decision-footer">
                    <Button variant="danger" size="sm" onClick={handleClear}>
                        Clear Decision
                    </Button>
                </Card.Footer>
            )}
        </Card>
    );
};

export default TripDecisionInfo;
