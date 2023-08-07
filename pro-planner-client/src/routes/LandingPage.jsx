// url validation reference: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
// url extraction reference: https://developer.mozilla.org/en-US/docs/Web/API/URL#Properties
import axios from 'axios';
import { useState, useRef } from 'react';
import { Card, Col, Container, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { changePlanType } from '../redux/planParamSlice';
import { ERR_TYPE, PLAN_TYPE } from '../constants';
import { setError } from '../redux/errorSlice';
import { buildServerRoute } from '../helpers/Utils';
import Button from '../components/override/Button';
import './LandingPage.scss';

const renderTooltip = (text, id) => (
    <Tooltip id={id} style={{ position: 'fixed' }}>
        {text}
    </Tooltip>
);

const LandingPage = () => {
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const tripButtonIcon = useRef(null);
    const outingButtonIcon = useRef(null);

    const [showTripTooltip, setShowTripTooltip] = useState(false);
    const [showOutingTooltip, setShowOutingTooltip] = useState(false);
    const planUrlRegex = /^https?:\/\/(?:[^\/:]+[:.])?[^\/:]+\/[^/]+$/;

    const handleInput = (e) => {
        setInputValue(e.target.value);
    };

    const isValidURL = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const isValidPlanURL = (url) => {
        return planUrlRegex.test(url);
    };

    const getPlanId = (value) => {
        return new URL(value).pathname.substring(1);
    };

    const handleJoin = (event) => {
        event.preventDefault();

        if (!inputValue) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Please enter a URL or Code.',
                })
            );
            return;
        }

        if (isValidURL(inputValue) && !isValidPlanURL(inputValue)) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: `Invalid URL format: example of a valid URL format is 'https://${process.env.REACT_APP_LIVE_DOMAIN}/PLAN_ID'.`,
                })
            );
            return;
        }

        if (isValidURL(inputValue) && isValidPlanURL(inputValue)) {
            let planId = getPlanId(inputValue);
            axios
                .get(buildServerRoute('plan', planId))
                .then(() => {
                    navigate(`/user/${planId}`);
                })
                .catch((err) => {
                    if (err.response.status === 404) {
                        dispatch(
                            setError({
                                errType: ERR_TYPE.ERR,
                                message: 'Plan does not exist, please enter an existing Plan URL.',
                            })
                        );
                    }
                });
        }

        if (!isValidURL(inputValue)) {
            axios
                .get(buildServerRoute('plan', inputValue))
                .then(() => {
                    navigate(`/user/${inputValue}`);
                })
                .catch((err) => {
                    if (err.response.status === 404) {
                        dispatch(
                            setError({
                                errType: ERR_TYPE.ERR,
                                message: 'Plan does not exist, please enter an existing Plan Code.',
                            })
                        );
                    }
                });
        }
    };

    const handleCreate = (planType) => {
        dispatch(changePlanType(planType));
        navigate(`create`);
    };

    return (
        <Container>
            <Row className="vh-100 d-flex justify-content-center align-items-center">
                <Col md={8} lg={6} xs={12}>
                    <div className="border-flair" />
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
                                            variant="custom-primary"
                                            size="lg"
                                            className="mb-2 w-50 m-auto d-flex"
                                            onClick={() => handleCreate(PLAN_TYPE.TRIP)}>
                                            <div className="m-auto">Trip</div>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={renderTooltip(
                                                    'Scheduling based on scale of half day increments. For planning longer trips/timeframes',
                                                    'trip-tooltip'
                                                )}>
                                                <span
                                                    className="float-end"
                                                    onMouseEnter={() => setShowTripTooltip(true)}
                                                    onMouseLeave={() => setShowTripTooltip(false)}
                                                    ref={tripButtonIcon}>
                                                    <FiInfo />
                                                </span>
                                            </OverlayTrigger>
                                        </Button>
                                    </Row>
                                    <Row className="text-center mb-3">
                                        <Button
                                            variant="custom-primary"
                                            size="lg"
                                            className="w-50 m-auto d-flex"
                                            onClick={() => handleCreate(PLAN_TYPE.OUTING)}>
                                            <div className="m-auto">Outing</div>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={renderTooltip(
                                                    'Scheduling based on scale of half hour increments. For planning a one-day event',
                                                    'outing-tooltip'
                                                )}>
                                                <span
                                                    className="float-end"
                                                    onMouseEnter={() => setShowOutingTooltip(true)}
                                                    onMouseLeave={() => setShowOutingTooltip(false)}
                                                    ref={outingButtonIcon}>
                                                    <FiInfo />
                                                </span>
                                            </OverlayTrigger>
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
                                                        variant="custom-primary"
                                                        type="submit"
                                                        className="mt-2"
                                                        onClick={handleJoin}>
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
