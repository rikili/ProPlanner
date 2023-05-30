import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FiInfo } from 'react-icons/fi';
import './LandingPage.css';

const LandingPage = () => {
	const renderTooltip = text => <Tooltip id="button-tooltip">{text}</Tooltip>;
	return (
		<div class="text-center card">
			<Container>
				<Row className="vh-100 d-flex justify-content-center align-items-center">
					<Col md={8} lg={6} xs={12}>
						<div className="border border-3 border-primary"></div>
						<Card className="shadow">
							<Card.Body>
								<div className="mt-md-4">
									<h2 className="fw-bold text-uppercase ">ProPlanner</h2>
									<p>Choose the Type of Plan you'd like to Create</p>
									<div className="mb-3">
										<Row>
											{/* <OverlayTrigger
												placement="top"
												overlay={renderTooltip('Tooltip for Trip')}
											>
											</OverlayTrigger> */}
											<Button
												variant="primary"
												size="lg"
												className="mb-2 createplan-btn"
											>
												Trip
												<OverlayTrigger
													placement="top"
													overlay={renderTooltip('Tooltip for Trip')}
												>
													<span className="i-icon">
														<FiInfo />
													</span>
												</OverlayTrigger>
											</Button>
										</Row>
										<Row>
											{/* <OverlayTrigger
												placement="top"
												overlay={renderTooltip('Tooltip for Outing')}
											>
											</OverlayTrigger> */}
											<Button
												variant="primary"
												size="lg"
												className="createplan-btn"
											>
												Outing
												<OverlayTrigger
													placement="top"
													overlay={renderTooltip('Tooltip for Outing')}
												>
													<span className="i-icon">
														<FiInfo />
													</span>
												</OverlayTrigger>
											</Button>
										</Row>
										<div className="mt-3">
											<p className="text-center">
												Joining a Plan? Enter the URL or Code.
												<Form className="join-form">
													<Form.Control placeholder="Plan URL/Code" />
													<div className="join-btn">
														<Button
															variant="primary"
															type="submit"
															className="mt-2"
														>
															Join
														</Button>
													</div>
												</Form>
											</p>
										</div>
									</div>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default LandingPage;
