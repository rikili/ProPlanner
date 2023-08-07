import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { isFirstHalf } from '../helpers/TripCalendar';
import { setPlanDecision } from '../redux/planParamSlice';
import { PLAN_TYPE } from '../constants';
import { useParams } from 'react-router-dom';
import Button from './override/Button';
import './DecisionInfo.scss';

const halfFlair = (date) => {
    return isFirstHalf(date) ? '(Morning)' : '(Evening)';
};

const DecisionInfo = () => {
    const { tripId } = useParams();
    const planType = useSelector((state) => state.planParameters.planType);
    const decisionRange = useSelector((state) => state.planParameters.decisionRange);
    const dispatch = useDispatch();
    const rangeSelected = !!decisionRange.length;

    const rangeStart = new Date(decisionRange[0]);
    const rangeEnd = new Date(decisionRange[1]);

    const handleClear = () => {
        dispatch(
            setPlanDecision({
                planId: tripId,
                planType,
                range: [],
            })
        );
    };

    return (
        <Card className="details-card">
            <Card.Header className="decision-body">
                <span>
                    <b>{planType === PLAN_TYPE.OUTING ? 'Outing ' : 'Trip '}</b>
                    <b>Decision</b>
                </span>
            </Card.Header>
            <Card.Body className="decision-body">
                <div className="decision-content">
                    {rangeSelected ? (
                        planType === PLAN_TYPE.OUTING ? (
                            <div className="decision-range">
                                <span>{format(rangeStart, 'h:mm a')}</span>
                                <span>{format(rangeStart, 'MMMM dd, yyyy')}</span>
                                <span style={{ color: 'black' }}>To</span>
                                <span>{format(rangeEnd, 'h:mm a')}</span>
                                <span>{format(rangeEnd, 'MMMM dd, yyyy')}</span>
                            </div>
                        ) : (
                            <div className="decision-range">
                                <span>{halfFlair(rangeStart)}</span>
                                <span>{format(rangeStart, 'MMMM dd, yyyy')}</span>
                                <span style={{ color: 'black' }}>To</span>
                                <span>{halfFlair(rangeEnd)}</span>
                                <span>{format(rangeEnd, 'MMMM dd, yyyy')}</span>
                            </div>
                        )
                    ) : (
                        <p className="decision-instruct">
                            This plan currently doesn't have a decision made.
                        </p>
                    )}
                </div>
            </Card.Body>
            {rangeSelected && (
                <Card.Footer className="decision-footer">
                    <Button variant="custom-danger" size="sm" onClick={handleClear}>
                        Clear Decision
                    </Button>
                </Card.Footer>
            )}
        </Card>
    );
};

export default DecisionInfo;
