import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
	const [inputValue, setInputValue] = useState('');
	const navigate = useNavigate();

	const handleInput = e => {
		setInputValue(e.target.value);
	};

	const renderTooltip = text => <Tooltip id="button-tooltip">{text}</Tooltip>;

	return (
		<Container>
			<Row className="vh-100 d-flex justify-content-center align-items-center">
				<Col md={8} lg={6} xs={12}>
					<div className="border border-3 border-primary"></div>
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
									<Row>
										<Button
											variant="primary"
											size="lg"
											className="mb-2 createplan-btn"
											onClick={() => navigate('/Trip')}
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
										<Button
											variant="primary"
											size="lg"
											className="createplan-btn"
											onClick={() => navigate('/Outing')}
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
										<div className="text-center">
											Joining a Plan? Enter the URL or Code.
											<Form className="join-form">
												<Form.Control
													placeholder="Enter URL/Code"
													value={inputValue}
													onChange={handleInput}
												/>
												<div className="join-btn">
													<Button
														variant="primary"
														type="submit"
														className="mt-2"
														onClick={() => navigate('/ExistingPlan')}
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
