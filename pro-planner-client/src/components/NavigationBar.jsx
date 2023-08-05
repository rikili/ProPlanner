import {
	Container,
	Nav,
	Navbar,
	NavDropdown,
	Tooltip,
	OverlayTrigger,
	Row,
	Col,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Clipboard from './Clipboard';
import Checkmark from './Checkmark';
import { useSelector, useDispatch } from 'react-redux';

import './NavigationBar.scss';
import { setIsEditing } from '../redux/planParamSlice';

const NavigationBar = ({ planId }) => {
	const selectedUser = useSelector(state => state.user.selectedUser);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		const URL = `http://localhost:3000/${planId}`;
		navigator.clipboard.writeText(URL);
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (copied) {
				setCopied(false);
			}
		}, 2000);

		return () => clearTimeout(timeout);
	}, [copied]);

	const renderTooltip = text => <Tooltip id="button-tooltip">{text}</Tooltip>;

	const handleEdit = () => {
		navigate('edit');
		dispatch(setIsEditing(true));
	};

	const toUserSelect = () => navigate(`/user/${planId}`);

	return (
		<>
			<Navbar bg="light">
				<Container>
					<Navbar.Brand>ProPlanner</Navbar.Brand>
					<Navbar.Collapse className="d-flex justify-content-between">
						<Nav className="d-flex gap-3">
							<Link to={`overview`} className="nav-link">
								<Nav.Item>Overview</Nav.Item>
							</Link>
							<Link to={`/${planId}`} className="nav-link">
								<Nav.Item>Scheduling</Nav.Item>
							</Link>
							<Link to={`vote`} className="nav-link">
								<Nav.Item>Voting</Nav.Item>
							</Link>
							<Link to={`cost`} className="nav-link">
								<Nav.Item>Cost</Nav.Item>
							</Link>
						</Nav>
						<Row className="align-items-center">
							<Col>
								<OverlayTrigger
									placement="bottom"
									overlay={renderTooltip('Copy Code')}
								>
									<button
										className="nav-link"
										onClick={() => {
											setCopied(true);
											handleCopy();
										}}
										style={{
											appearance: 'none',
											padding: 8,
											border: 0,
											outline: 0,
											curser: 'pointer',
										}}
									>
										<div style={{ position: 'relative', width: 5, height: 15 }}>
											<Clipboard
												style={{
													position: 'absolute',
													color: 'black',
													top: 0,
													left: 0,
													strokeDasharray: 50,
													strokeDashoffset: copied ? -50 : 0,
													transition: 'all 300ms ease-in-out',
												}}
											/>
											<Checkmark
												isVisible={copied}
												style={{
													color: 'green',
													position: 'absolute',
													top: 0,
													left: 0,
													strokeDasharray: 50,
													strokeDashoffset: copied ? 0 : -50,
													transition: 'all 300ms ease-in-out',
												}}
											/>
										</div>
									</button>
								</OverlayTrigger>{' '}
							</Col>
							<Col>
								<NavDropdown
									title={`Hello, ${selectedUser ? selectedUser : 'User'} `}
								>
									<NavDropdown.Item onClick={toUserSelect}>
										Change user
									</NavDropdown.Item>
									<NavDropdown.Item onClick={handleEdit}>
										Edit plan
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item href="/">Start a new Plan</NavDropdown.Item>
								</NavDropdown>
							</Col>
						</Row>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
};

export default NavigationBar;
