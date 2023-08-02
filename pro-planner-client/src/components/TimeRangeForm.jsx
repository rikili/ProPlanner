import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { getTime } from '../helpers/OutingCalendar';

const roundingSteps = [0, 30, 60];

const TimeRangeForm = ({ editDetails }) => {
    const [isAllDay, setAllDay] = useState(false);
    const startTimeInput = useRef(null);
    const endTimeInput = useRef(null);

    const isEditing = !!editDetails;
    useEffect(() => {
        if (isEditing) {
            const startTime = getTime(new Date(editDetails.dateTimeRange[0][0]));
            const endTime = getTime(new Date(editDetails.dateTimeRange[1]));
            if ((startTime === '00:00' && endTime === '23:59') || editDetails.isAllDay) {
                setAllDay(true);
            } else {
                startTimeInput.current.value = startTime;
                endTimeInput.current.value = endTime;
            }
        }
    }, [editDetails, isEditing]);

    const toggleIsAllDay = () => {
        setAllDay(!isAllDay);
    };

    const handleTimeBlur = (event) => {
        const strVal = event.target.value;
        if (strVal) {
            const timeSplit = strVal.match(/[0-9]+/g);
            const minVal = Number(timeSplit[1]);
            const closestStep = roundingSteps
                .map((step) => Math.abs(step - minVal))
                .reduce(
                    (lowestSoFar, currDiff, index) => {
                        const diff = lowestSoFar[0];
                        if (diff >= currDiff) return [currDiff, index];
                        return lowestSoFar;
                    },
                    [60, 0]
                );
            let newHour = Number(timeSplit[0]);
            let newMin = roundingSteps[closestStep[1]];
            const updateHour = newMin === 60;
            if (updateHour) {
                newMin = 0;
                newHour = newHour >= 23 ? 0 : newHour + 1;
            }
            event.target.value = `${newHour.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
            })}:${newMin.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;
        }
    };

    return (
        <Card className="p-2">
            <Card.Body>
                <h6 className="mb-2">
                    <b>Set a Time Range</b>
                </h6>
                <p style={{fontSize: '0.8em', color: 'grey'}}>Select a time range or set the plan to be All-Day</p>
                <div>
                    <Row className="mb-2">
                        <Form.Group controlId="planTimeStart" as={Col}>
                            <Form.Label>Start Time </Form.Label>
                            <Form.Control
                                ref={startTimeInput}
                                type="time"
                                className={`${isAllDay ? '' : 'Disabled readonly'}`}
                                disabled={isAllDay}
                                onBlur={handleTimeBlur}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="planTimeEnd" as={Col}>
                            <Form.Label>End Time </Form.Label>
                            <Form.Control
                                ref={endTimeInput}
                                type="time"
                                className={`${isAllDay ? '' : 'Disabled readonly'}`}
                                disabled={isAllDay}
                                onBlur={handleTimeBlur}
                                required
                            />
                        </Form.Group>
                    </Row>
                    <div className="w-100">
                        <p className="text-center mb-2">OR</p>
                        <Form.Group controlId="planIsAllDay" as={Col}>
                            <Form.Control value={isAllDay || ''} style={{ display: 'none' }} readOnly />
                            <Button
                                className="w-100"
                                variant={`${isAllDay ? 'primary' : 'secondary'}`}
                                active={isAllDay}
                                onClick={() => toggleIsAllDay()}
                            >
                                All-Day
                            </Button>
                        </Form.Group>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TimeRangeForm;
