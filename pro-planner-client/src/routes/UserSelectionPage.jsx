import { useState, useEffect } from 'react';
import { Card, Container, Toast, ToastContainer } from 'react-bootstrap';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { getUserAsync } from '../redux/userSlice';
import { setCodeReadyToCopy } from '../redux/planParamSlice';
import UserList from '../components/UserList';
import AddUserForm from '../components/AddUserForm';
import './UserSelectionPage.scss';

const UserSelectionPage = () => {
    const dispatch = useDispatch();
    const codeReadyToCopy = useSelector((state) => state.planParameters.codeReadyToCopy);
    const [show, setShow] = useState(false);
    const planId = useLocation().pathname.split('/')[2];

	useEffect(() => {
		if (codeReadyToCopy) {
			const URL = `${window.location.origin}/${planId}`;
			navigator.clipboard.writeText(URL);
			setShow(true);
		}
		dispatch(getUserAsync({ planId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

    const handleCloseToast = () => {
        setShow(false);
        dispatch(setCodeReadyToCopy(false));
    };

    return (
        <>
            <ToastContainer position={'top-end'}>
                <Toast
                    className="m-3 toast"
                    show={show}
                    onClose={handleCloseToast}
                    bg={'light'}
                    delay={2500}
                    autohide>
                    <Toast.Header closeButton={false} className="d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                            <IoIosCheckmarkCircle className="icon" />
                            <strong className="ms-2">ProPlanner</strong>
                        </div>
                    </Toast.Header>
                    <Toast.Body style={{ color: 'black' }}>
                        Plan link copied to your clipboard.
                    </Toast.Body>
                </Toast>
            </ToastContainer>
            <Container className="d-flex h-75 align-items-center flex-column pt-5">
                <h2 className="fw-bold">ProPlanner</h2>
                <div className="user-select-card-container">
                    <Card className="user-list-card">
                        <UserList />
                    </Card>
                    <Card className="add-user-card">
                        <AddUserForm />
                    </Card>
                </div>
            </Container>
        </>
    );
};

export default UserSelectionPage;
