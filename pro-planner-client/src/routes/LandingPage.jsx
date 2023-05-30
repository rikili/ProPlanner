import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Tooltip from 'react-bootstrap/Tooltip';

const LandingPage = () => {
	// const renderTooltip = text => <Tooltip id="button-tooltip">{text}</Tooltip>;
	return (
		<div class="text-center">
			<Container>
				<Row className="vh-100 d-flex justify-content-center align-items-center">
					<Col md={8} lg={6} xs={12}>
						<div className="border border-3 border-info"></div>
						<Card className="shadow">
							<Card.Body>
								<div className="mb-3 mt-md-4">
									<h2 className="fw-bold text-uppercase ">ProPlanner</h2>
									<p className=" mb-5">
										Choose the Type of Plan you'd like to Create
									</p>
									<div className="mb-3">
										<Row>
											<Button variant="info" size="lg" className="mb-2">
												Trip
											</Button>
										</Row>
										<Row>
											<Button variant="info" size="lg">
												Outing
											</Button>
										</Row>
										<div className="mt-3">
											<p className="mb-0  text-center">
												Joining a Plan? Enter the URL or Code.
												<Form>
													<Form.Control placeholder="Plan URL/Code" />
												</Form>
											</p>
										</div>
									</div>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				{/* <Card>
					<Card.Body>
						<Card.Title>Choose type of plan to create</Card.Title>
						<div className="d-grid gap-2">
							<OverlayTrigger placement="top" overlay={renderTooltip('Outing')}>
								<Button variant="primary" size="lg">
									Outing

								</Button>
							</OverlayTrigger>
							<OverlayTrigger
								placement="top"
								overlay={renderTooltip('Tooltip for Trip')}
							>
								<Button variant="secondary" size="lg">
									Trip
								</Button>
							</OverlayTrigger>
						</div>
					</Card.Body>
				</Card>
				<Card>
					<Card.Body>
						<Card.Title>Join a Plan</Card.Title>
						<Form>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Control
									type="email"
									placeholder="Enter a Plan URL or ID to join"
								/>
							</Form.Group>
							<Button variant="primary" type="submit">
								Submit
							</Button>
						</Form>
					</Card.Body>
				</Card> */}
			</Container>
		</div>
	);
};

export default LandingPage;
