import React from 'react';
import {Card, Col, Container, Row} from 'react-bootstrap';
import './OverviewPage.scss';
import ExpenseSplit from '../components/ExpenseSplit';
import {useSelector} from 'react-redux';
import Map from '../components/Map';
import {format, parseISO} from "date-fns";

const OverviewPage = () => {
    const tripName = useSelector((state) => state.planParameters.name);
    const location = useSelector((state) => state.planParameters.location);
    const decidedDates = useSelector(state => state.planParameters.decisionRange);
    const description = useSelector(state => state.planParameters.description);
    // const decidedDates = ["2023-07-31T07:00:00.000Z", "2023-08-04T06:59:59.099Z"] // testing purpose
    // const tripName = 'Trip Name'; // testing purpose
    // const location = 'Vancouver'; // testing purpose
    // const description = "description test"; // testing purpose


    function processDecidedDates(decidedDates) {
        if (!decidedDates || decidedDates.length !== 2) {
            return "Dates are not set"
        }
        const [startDate, endDate] = decidedDates;
        const processedStartDate = format(parseISO(startDate), 'EEE, MMM d yyyy');
        const processedEndDate = format(parseISO(endDate), 'EEE, MMM d yyyy');
        return `${processedStartDate} - ${processedEndDate}`
    }

    const processedDecidedDates = processDecidedDates(decidedDates);

    return (
        <>
            <Container className="overview-container">
                <Row className="overview-header-row">{tripName}</Row>
                <Row className="overview-map-row">
                    <Card className="overview-map-card">
                        <Map/>
                    </Card>
                </Row>
                <Row className="overview-details-cost-row">
                    <Col className="overview-details-col">
                        <Card className="overview-details-card">
                            <Card.Body>
                                <Card.Title>Details</Card.Title>
                                <Card.Subtitle>Dates:</Card.Subtitle>
                                <Card.Text>{processedDecidedDates}</Card.Text>
                                <Card.Subtitle>Location:</Card.Subtitle>
                                <Card.Text>{location}</Card.Text>
                                {description ? <Card.Subtitle>Description:</Card.Subtitle> : null}
                                {description ? <Card.Text>{description}</Card.Text> : null}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="overview-cost-col">
                        <Card className="overview-cost-card">
                            <Card.Body>
                                <Card.Title>Costs</Card.Title>
                                <ExpenseSplit/>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default OverviewPage;


