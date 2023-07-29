import React from 'react';
import NavigationBar from '../components/NavigationBar';
import { Card, Col, Container, Row } from 'react-bootstrap';
import './OverviewPage.scss';
import ExpenseSplit from '../components/ExpenseSplit';
import { useSelector } from 'react-redux';
import Map from '../components/Map';

const OverviewPage = () => {
	// const tripName = useSelector((state) => state.planParameters.name);
	// const location = useSelector((state) => state.planParameters.location);
	const decidedDates = useSelector(state => state.planParameters.decisionRange); // TODO: process decidedDates by plan type
	const tripName = 'Trip Name'; // testing purpose
	const location = 'Vancouver'; // testing purpose

	return (
		<>
			<NavigationBar />
			<Container className="overview-container">
				<Row className="overview-header-row">{tripName}</Row>
				<Row className="overview-map-row">
					<Card className="overview-map">
						<Map />
					</Card>
				</Row>
				<Row className="overview-details-cost-row">
					<Col className="overview-details-col">
						<Card className="overview-details-card">
							<Card.Body>
								<Card.Title>Details</Card.Title>
								<Card.Subtitle>Dates:</Card.Subtitle>
								<Card.Text>
									{/*TODO: process decidedDates by plan type */}
									{decidedDates.length > 0 ? decidedDates : `Dates not set`}
								</Card.Text>
								<Card.Subtitle>Location:</Card.Subtitle>
								<Card.Text>{location}</Card.Text>
								<Card.Subtitle>Description:</Card.Subtitle>
								<Card.Text>Bring umbrella</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col className="overview-cost-col">
						<Card className="overview-cost-card">
							<Card.Body>
								<Card.Title>Costs</Card.Title>
								<ExpenseSplit />
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default OverviewPage;
