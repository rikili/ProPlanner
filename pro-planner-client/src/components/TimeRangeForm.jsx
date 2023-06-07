import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';

const roundingSteps = [0, 15, 30, 45, 60];

const TimeRangeForm = forwardRef((props, ref) => {
    const [isAllDay, setAllDay] = useState(false);
    const timeForm = useRef(null);

    const toggleIsAllDay = () => {
        setAllDay(!isAllDay);
    }

    useImperativeHandle(ref, () => {
        return {
            retrieveData: () => {
                return {
                    isAllDay: isAllDay,
                    timeRange: isAllDay ? [] : [
                        timeForm.current.formTimeStart.value,
                        timeForm.current.formTimeEnd.value,
                    ]
                }
            },
        }
    });


    const handleTimeBlur = (event) => {
        const strVal = event.target.value;
        if (strVal) {
            const timeSplit = strVal.match(/[0-9]+/g);
            const minVal = Number(timeSplit[1]);
            const closestStep = roundingSteps.map((step) => Math.abs(step - minVal))
                .reduce((lowestSoFar, currDiff, index) => {
                    const diff = lowestSoFar[0];
                    if (diff >= currDiff) return [currDiff, index];
                    return lowestSoFar;
                }, [60, 0]);
            let newHour = Number(timeSplit[0]);
            let newMin = roundingSteps[closestStep[1]];
            const updateHour = newMin === 60;
            if (updateHour) {
                newMin = 0;
                newHour = newHour >= 23 ? 0 : newHour + 1;
            }
            event.target.value = `${newHour.toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${newMin.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;
        }
    }

    return <Card className="m-3">
        <Card.Body className="ps-5 pe-5">
            <h6 className="mb-4"><b>Set a Time Range</b></h6>
            <Form className="d-flex flex-column align-items-center" ref={timeForm} onSubmit={(e) => e.preventDefault()}>
                <Row className="mb-2">
                    <Form.Group controlId="formTimeStart" as={Col}>
                        <Form.Label>Start Time </Form.Label>
                        <Form.Control type='time' className={`${isAllDay ? '' : 'Disabled readonly'}`} disabled={isAllDay} onBlur={handleTimeBlur} />
                    </Form.Group>
                    <Form.Group controlId="formTimeEnd" as={Col}>
                        <Form.Label>End Time </Form.Label>
                        <Form.Control type='time' className={`${isAllDay ? '' : 'Disabled readonly'}`} disabled={isAllDay} onBlur={handleTimeBlur} />
                    </Form.Group>
                </Row>
                <div className="w-100">
                    <p className="text-center mb-2">OR</p>
                    <Button
                        className="w-100"
                        variant={`${isAllDay ? 'primary' : 'secondary'}`}
                        active={isAllDay}
                        onClick={() => toggleIsAllDay()}
                    >
                        All-Day
                    </Button>
                </div>
            </Form>
        </Card.Body>
    </Card>
});

export default TimeRangeForm;
