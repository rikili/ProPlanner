import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';

import './NavigationBar.scss';

const NavigationBar = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();

    return <>
        <Navbar bg="light">
            <Container>
                <Navbar.Brand>ProPlanner</Navbar.Brand>
                <Navbar.Collapse className="d-flex justify-content-between">
                    <Nav className="d-flex gap-3">
                        <Link to={`/${tripId}`} className="nav-link">
                            <Nav.Item>Scheduling</Nav.Item>
                        </Link>
                        <Link to={`vote`} className="nav-link">
                            <Nav.Item>Voting</Nav.Item>
                        </Link>
                        <Link to={`cost`} className="nav-link">
                            <Nav.Item>Cost</Nav.Item>
                        </Link>
                    </Nav>
                    <NavDropdown title="Hello, User">
                        <NavDropdown.Item>
                            Change User
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                            Edit plan
                        </NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item onClick={() => navigate('/')}>
                            Start a new Plan
                        </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
};

export default NavigationBar;
