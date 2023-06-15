import React from 'react';
import {InputGroup, Button, Form, Card, Container} from "react-bootstrap";

function AddPollForm() {
    return (
        <>
            <Container className='d-flex flex-column mt-4 justify-content-center align-items-center'>
                <Card className='mt-4 p-4 d-flex' style={{width: '700px', height: '90px'}}>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Poll Question"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                        />
                        <Button variant="outline-secondary" id="button-addon2">
                            Add
                        </Button>
                    </InputGroup>
                </Card>
            </Container>
        </>
    );
}

export default AddPollForm;