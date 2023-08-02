import React, { useState, useRef } from 'react';
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Overlay,
    OverlayTrigger,
    Row,
    Tooltip
} from 'react-bootstrap';
import { FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { changePlanType } from '../redux/planParamSlice';
import { PLAN_TYPE } from '../constants';

const LandingPage = () => {
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const tripButtonIcon = useRef(null);
    const outingButtonIcon = useRef(null);

    const [showTripTooltip, setShowTripTooltip] = useState(false);
    const [showOutingTooltip, setShowOutingTooltip] = useState(false);

    const handleInput = e => {
        setInputValue(e.target.value);
    };

    const handleJoin = (event) => {
        event.preventDefault();
        navigate(`/user/${inputValue}`);
    }

    const handleCreate = (planType) => {
        dispatch(changePlanType(planType));
        navigate(`create`);
    }

    return (
        <Container>
            <Row className="vh-100 d-flex justify-content-center align-items-center">
                <Col md={8} lg={6} xs={12}>
                    <div className="border border-3 border-primary" style={{position: 'relative', top: '0.3em', zIndex: '1'}} />
                    <Card className="shadow">
                        <Card.Body>
                            <div className="mt-md-4">
                                <h2 className="fw-bold text-uppercase d-flex justify-content-center align-items-center">
                                    ProPlanner
                                </h2>
                                <p className="d-flex justify-content-center align-items-center">
                                    Choose the Type of Plan you'd like to Create
                                </p>
                                <div className="mb-3">
                                    <Row className="text-center mb-3">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="mb-2 w-50 m-auto d-flex"
                                            onClick={() => handleCreate(PLAN_TYPE.TRIP)}
                                        >
                                            <div className="m-auto">Trip</div>
                                            <span className="float-end"
                                                  onMouseEnter={() => setShowTripTooltip(true)}
                                                  onMouseLeave={() => setShowTripTooltip(false)}
                                                  ref={tripButtonIcon}>
                                                <FiInfo />
                                            </span>
                                            <Overlay
                                                target={tripButtonIcon.current}
                                                show={showTripTooltip}
                                                placement="top"
                                            >
                                                {(props) => (
                                                    <Tooltip {...props}>
                                                        {'Scheduling based on scale of half day increments. For planning longer trips/timeframes'}
                                                    </Tooltip>
                                                )}
                                            </Overlay>
                                        </Button>
                                    </Row>
                                    <Row className="text-center mb-3">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="w-50 m-auto d-flex"
                                            onClick={() => handleCreate(PLAN_TYPE.OUTING)}
                                        >
                                            <div className="m-auto">Outing</div>
                                            <span className="float-end"
                                                  onMouseEnter={() => setShowOutingTooltip(true)}
                                                  onMouseLeave={() => setShowOutingTooltip(false)}
                                                  ref={outingButtonIcon}>
                                                <FiInfo />
                                            </span>
                                            <Overlay
                                                target={outingButtonIcon.current}
                                                show={showOutingTooltip}
                                                placement="bottom"
                                            >
                                                {(props) => (
                                                    <Tooltip {...props}>
                                                        {'Scheduling based on scale of half hour increments. For planning a one-day event'}
                                                    </Tooltip>
                                                )}
                                            </Overlay>
                                        </Button>
                                    </Row>
                                    <div className="mt-3">
                                        <div className="text-center">
                                            Joining a Plan? Enter the URL or Code.
                                            <Form className="join-form">
                                                <Form.Control
                                                    placeholder="Enter URL/Code"
                                                    value={inputValue}
                                                    onChange={handleInput}
                                                />
                                                <div className="m-auto align-middle text-center mt-4">
                                                    <Button
                                                        variant="primary"
                                                        type="submit"
                                                        className="mt-2"
                                                        onClick={handleJoin}
                                                    >
                                                        Join
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LandingPage;
