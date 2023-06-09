import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Card, Form, Row, ButtonGroup, Button, Col } from 'react-bootstrap';

const InputDetailsForm = forwardRef(({ title = false }, ref) => {
    const [selectedDays, setSelectedDays] = useState({
        'Su': true,
        'Mo': true,
        'Tu': true,
        'We': true,
        'Th': true,
        'Fr': true,
        'Sa': true,
    });
    const formRef = useRef(null);

    const formatSelectedDays = () => {
        const result = [];
        Object.entries(selectedDays).forEach(([_, isSelected], index) => {
            if (isSelected) {
                result.push(index);
            }
        });
        return result;
    }

    const reformatDateString = (inpString) =>  {
        const splits = inpString.match(/[0-9]+/g);
        return `${splits[1]}-${splits[2]}-${splits[0]}`;
    }

    useImperativeHandle(ref, () => {
        return {
            retrieveData: () => {
                return {
                    name: formRef.current.formPlanName.value,
                    location: formRef.current.formPlanLoc.value,
                    budget: formRef.current.formPlanBudget.value,
                    dateRange: [
                        reformatDateString(formRef.current.formPlanStartDate.value),
                        reformatDateString(formRef.current.formPlanEndDate.value)
                    ],
                    selectedDaysOfWeek: formatSelectedDays(),
                };
            }
        }
    });

    const updateSelection = (dayLabel) => {
        const newSelection = {...selectedDays};
        newSelection[dayLabel] = !selectedDays[dayLabel]
        setSelectedDays(newSelection);
    }

    return <Card className="m-3">
        {title && <Card.Title className="m-3 mb-0">
            <h2>{title}</h2>
        </Card.Title>}
        <Card.Body className="ps-5 pe-5">
            <h6><b>Details</b></h6>
            <Form className="d-flex flex-column" ref={formRef} onSubmit={e => e.preventDefault()}>
                <Form.Group controlId="formPlanName" className="mb-2">
                    <Form.Label>Plan Name </Form.Label>
                    <Form.Control type="text" placeholder="Name your plan" />
                </Form.Group>

                <Form.Group controlId="formPlanLoc" className="mb-2">
                    <Form.Label>Location </Form.Label>
                    <Form.Control type="text" placeholder="Name your destination" />
                </Form.Group>

                <Form.Group controlId="formPlanBudget" className="mb-2">
                    <Form.Label>Budget </Form.Label>
                    <Form.Control type="number" placeholder="Choose your budget" />
                </Form.Group>

                <Row className="d-flex flex-row">
                    <Form.Group as={Col} controlId="formPlanStartDate" className="mb-2">
                        <Form.Label>Start Date </Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formPlanEndDate" className="mb-4">
                        <Form.Label>End Date </Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>
                </Row>

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
            </Form>
        </Card.Body>
    </Card>
});

export default InputDetailsForm;
