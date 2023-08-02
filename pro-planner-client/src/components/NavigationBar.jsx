import { useSelector, useDispatch } from 'react-redux';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';

import './NavigationBar.scss';
import { setIsEditing } from '../redux/planParamSlice';

const NavigationBar = ({ planId }) => {
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate('edit');
        dispatch(setIsEditing(true));
    };

    const toUserSelect = () => navigate(`/user/${planId}`);

    return <>
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
                    <NavDropdown title={`Hello, ${selectedUser ? selectedUser : 'User'} `}>
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
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
};

export default NavigationBar;
