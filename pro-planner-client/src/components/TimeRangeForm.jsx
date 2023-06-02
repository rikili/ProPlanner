import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';

const TimeRangeForm = forwardRef((_, ref) => {
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

    return <Card className="m-3">
        <Card.Body className="ps-5 pe-5">
            <h6 className="mb-2"><b>Set Date Range</b></h6>
            <Form className="d-flex flex-column align-items-center" ref={timeForm} onSubmit={(e) => e.preventDefault()}>
                <Row className="mb-2">
                    <Form.Group controlId="formTimeStart" as={Col}>
                        <Form.Label>Start Time </Form.Label>
                        <Form.Control type='time' className={`${isAllDay ? '' : 'Disabled readonly'}`} disabled={isAllDay} />
                    </Form.Group>
                    <Form.Group controlId="formTimeEnd" as={Col}>
                        <Form.Label>End Time </Form.Label>
                        <Form.Control type='time' className={`${isAllDay ? '' : 'Disabled readonly'}`} disabled={isAllDay} />
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
