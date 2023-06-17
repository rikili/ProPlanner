import React from 'react';
import {Col, Container, Form, ProgressBar, Row} from "react-bootstrap";

function Option({option}) {
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Form.Check
                            type={'radio'}
                            id={'default-radio'}
                            label={option.option}
                        />
                    </Col>
                    <Col>
                        <ProgressBar now={6} label={'6'}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Option;