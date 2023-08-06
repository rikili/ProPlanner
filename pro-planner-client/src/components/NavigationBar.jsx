// getting url references: https://www.freecodecamp.org/news/how-to-get-the-current-url-with-javascript/

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
		const URL = `${window.location.origin}/${planId}`;
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

	const renderTooltip = (text) => <Tooltip id="button-tooltip" style={{position: "fixed"}}>{text}</Tooltip>;

	const handleEdit = () => {
		navigate('edit');
		dispatch(setIsEditing(true));
	};

	const toUserSelect = () => navigate(`/user/${planId}`);

    return <>
        <Navbar className="navigation-bar" collapseOnSelect expand="lg">
            <Container className="nav-container">
                <Link to={`/${planId}`} className="navlink">
                    <Navbar.Brand as="h4" bsPrefix="nav-brand">ProPlanner</Navbar.Brand>
                </Link>
                <Navbar.Toggle bsPrefix={"toggle-button"}/>
                <Navbar.Collapse id="responsive-navbar-nav" className="navbar-collapse">
                    <Nav className="nav-content">
                        <div className="navbar-divider-vertical"/>
                        <Link to={`/${planId}`} className="navlink on-bar">
                            <Nav.Item className="navtext">Overview</Nav.Item>
                        </Link>
                        <Link to={'schedule'} className="navlink on-bar">
                            <Nav.Item className="navtext">Scheduling</Nav.Item>
                        </Link>
                        <Link to={'vote'} className="navlink on-bar">
                            <Nav.Item className="navtext">Voting</Nav.Item>
                        </Link>
                        <Link to={'cost'} className="navlink on-bar">
                            <Nav.Item className="navtext">Cost</Nav.Item>
                        </Link>
                    </Nav>
                    <div className="navbar-divider-horizontal"/>
					<div className="user-link-group">
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
											color: 'white',
											top: 0,
											left: 0,
											strokeDasharray: 50,
											strokeDashoffset: copied ? -50 : 0,
											transition: 'all 300ms ease-in-out',
										}}
									/>
									<Checkmark
										visibility={String(copied)}
										style={{
											color: 'rgb(116, 212, 106)',
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
						</OverlayTrigger>
						<NavDropdown className="user-dropdown" title={`Hello, ${selectedUser ? selectedUser : 'User'} `}>
							<NavDropdown.Item onClick={toUserSelect}>
								Change user
							</NavDropdown.Item>
							<NavDropdown.Item onClick={handleEdit}>
								Edit plan
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href='/'>
								Start a new Plan
							</NavDropdown.Item>
						</NavDropdown>
					</div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
};

export default NavigationBar;
