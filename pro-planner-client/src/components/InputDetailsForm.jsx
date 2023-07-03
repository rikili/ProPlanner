/* REFERENCES:

Google Maps Geocoding API Docs: https://developers.google.com/maps/documentation/geocoding

Google Maps Places Autocomplete API Docs: https://developers.google.com/maps/documentation/javascript/place-autocomplete

*/

import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Card, Form, Row, ButtonGroup, Button, Col } from 'react-bootstrap';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';





const InputDetailsForm = forwardRef(({ title = false }, ref) => {

    const { isLoaded } = useJsApiLoader({
		//NOTE: manually insert API KEY. .env file not working right now.
		googleMapsApiKey: '***********************',

		libraries: ['places'],
	});



    const [selectedDays, setSelectedDays] = useState({
        'Su': false,
        'Mo': false,
        'Tu': false,
        'We': false,
        'Th': false,
        'Fr': false,
        'Sa': false,
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

    useImperativeHandle(ref, () => {
        return {
            retrieveData: () => {
                return {
                    name: formRef.current.formPlanName.value,
                    location: formRef.current.formPlanLoc.value,
                    dateRange: [
                        formRef.current.formPlanStartDate.value,
                        formRef.current.formPlanEndDate.value
                    ],
                    availableDays: formatSelectedDays(),
                };
            }
        }
    });

    const updateSelection = async (dayLabel) => {
        const newSelection = {...selectedDays};
        newSelection[dayLabel] = !selectedDays[dayLabel]
        setSelectedDays(newSelection);
        // const results = getLatLng(formRef.current.formPlanLoc.value);
    }
    
    
    


    if (!isLoaded) {
        return <> Loading.. </>
    }

    return <Card className="m-3">
        {title && <Card.Title className="m-3 mb-0">
            <h2>{title}</h2>
        </Card.Title>}
        <Card.Body className="ps-5 pe-5">
            <h6><b>Plan Details</b></h6>
            <Form className="d-flex flex-column" ref={formRef} onSubmit={e => e.preventDefault()}>
                <Form.Group controlId="formPlanName" className="mb-2">
                    <Form.Label>Plan Name </Form.Label>
                    <Form.Control type="text" placeholder="Name your plan" />
                </Form.Group>

                <Form.Group controlId="formPlanLoc" className="mb-2">
                    <Form.Label>Location </Form.Label>
                    <Autocomplete>
                        <Form.Control type="text" placeholder="Name your destination"/>
                    </Autocomplete>
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
