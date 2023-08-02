import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Card, Form, Row, ButtonGroup, Button, Col } from 'react-bootstrap';
import { dayOffsetToDOW } from '../helpers/Calendar';
import { PLAN_TYPE } from '../constants';
import { format } from 'date-fns';

import './InputDetailsForm.scss';

const dateToInputValue = (date) => {
    return format(date, 'yyyy-MM-dd');
}

const InputDetailsForm = ({ title = false, editDetails }) => {
    const [selectedDays, setSelectedDays] = useState({
        'Su': true,
        'Mo': true,
        'Tu': true,
        'We': true,
        'Th': true,
        'Fr': true,
        'Sa': true,
    });
    const startDateInput = useRef(null);
    const endDateInput = useRef(null);
    const nameInput = useRef(null);
    const locationInput = useRef(null);
    const descriptionInput = useRef(null);
    const budgetInput = useRef(null);

    const isEditing = !!editDetails;

    let startDate;
    let endDate;
    if (isEditing) {
        startDate = new Date((editDetails.planType === PLAN_TYPE.OUTING)
            ? editDetails.dateTimeRange[0][0]
            : editDetails.dateTimeRange[0]);
        endDate = new Date(editDetails.dateTimeRange[1]);
    }

    useEffect(() => {
        if (isEditing) {
            const daysOfWeek = dayOffsetToDOW(startDate, editDetails.dayOffset);
    
            const newEditState = {};
            Object.keys(selectedDays).forEach((weekDayIndex, index) => {
                if (daysOfWeek.includes(index)) {
                    newEditState[weekDayIndex] = true;
                } else {
                    newEditState[weekDayIndex] = false;
                }
            });
            setSelectedDays(newEditState);

            startDateInput.current.value = dateToInputValue(startDate);
            endDateInput.current.value = dateToInputValue(endDate);
            nameInput.current.value = editDetails.name;
            locationInput.current.value = editDetails.location;
            editDetails.budget && (budgetInput.current.value = editDetails.budget);
        }
    }, [editDetails, isEditing]);

    const updateSelection = (dayLabel) => {
        const newSelection = {...selectedDays};
        newSelection[dayLabel] = !selectedDays[dayLabel]
        setSelectedDays(newSelection);
    }

    return <Card className="p-2">
        {title && <Card.Title>
            <h2>{title}</h2>
        </Card.Title>}
        <Card.Body>
            <h6><b>Details</b></h6>
            <p className="detail-form-instruct">* - Required fields</p>
            <div>
                <Form.Group controlId="planName" className="mb-2">
                    <Form.Label>Plan Name* </Form.Label>
                    <Form.Control type="text" placeholder="Name your plan" ref={nameInput} required/>
                </Form.Group>

                <Form.Group controlId="planLocation" className="mb-2">
                    <Form.Label>Location* </Form.Label>
                    <Form.Control type="text" placeholder="Name your destination" ref={locationInput} required/>
                </Form.Group>

                <Form.Group controlId="planBudget" className="mb-2">
                    <Form.Label>Budget </Form.Label>
                    <Form.Control type="number" placeholder="Choose your budget" ref={budgetInput}/>
                </Form.Group>

                <Row className="d-flex flex-row">
                    <Form.Group as={Col} controlId="planStartDate" className="mb-2">
                        <Form.Label>Start Date* </Form.Label> 
                        <Form.Control type="date" ref={startDateInput} required/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="planEndDate" className="mb-4">
                        <Form.Label>End Date* </Form.Label>
                        <Form.Control type="date" ref={endDateInput} required/>
                    </Form.Group>
                </Row>

                <Form.Group controlId="planDOWs">
                    <Form.Control style={{display: 'none'}} value={JSON.stringify(selectedDays)} readOnly/>
                    <ButtonGroup size="sm" className="d-flex flex-wrap gap-1 mx-auto w-100" style={{maxWidth: "50%"}}>
                        {Object.entries(selectedDays).map(([dayLabel, isSelected], index) => {
                            return <Button
                                className="rounded"
                                variant={`${isSelected ? 'primary' : 'secondary'}`}
                                active={isSelected}
                                key={`${dayLabel}-${index}`}
                                onClick={() => updateSelection(dayLabel)}
                            >
                                {dayLabel}
                            </Button>
                        })}
                    </ButtonGroup>
                </Form.Group>
            </div>
        </Card.Body>
    </Card>
};

export default InputDetailsForm;
