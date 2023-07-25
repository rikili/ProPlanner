import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import './TripDecisionInfo.scss';
import { isFirstHalf } from '../helpers/TripCalendar';
import { setDecisionRange } from '../redux/planParamSlice';

const halfFlair = (date) => {
    return isFirstHalf(date) ? '(Morning)' : '(Evening)'
}

const TripDecisionInfo = () => {
    const decisionRange = useSelector((state) => state.planParameters.decisionRange);
    const dispatch = useDispatch();
    const rangeSelected = !!decisionRange.length;

    const rangeStart = new Date(decisionRange[0]);
    const rangeEnd = new Date(decisionRange[1]);

    const handleClear = () => {
        dispatch(setDecisionRange([]));
    }

    return (
        <Card className="details-card">
            <Card.Body className="decision-body">
                <b>Trip Decision</b>
                <div className="decision-content">
                    {rangeSelected ? (
                        <>
                            <div className="decision-range">
                                <span>{halfFlair(rangeStart)}</span>
                                <span>{format(rangeStart, 'MMMM dd, yyyy')}</span>
                                <span style={{color: 'black'}}>To</span>
                                <span>{halfFlair(rangeEnd)}</span>
                                <span>{format(rangeEnd, 'MMMM dd, yyyy')}</span>
                            </div>
                            <Button variant="danger" size="sm" className='mt-2' onClick={handleClear}>Clear Decision</Button>
                        </>
                    ) : (
                        <p className="trip-decision-instruct">This plan currently doesn't have a decision made.</p>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default TripDecisionInfo;
