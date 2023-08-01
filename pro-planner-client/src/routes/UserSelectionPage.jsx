import React, { useEffect } from 'react';
import UserList from '../components/UserList';
import AddUserForm from '../components/AddUserForm';
import { Card, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { getUserAsync } from '../redux/userSlice';

const UserSelectionPage = () => {
	const dispatch = useDispatch();

	const planId = useLocation().pathname.split('/')[2];
	useEffect(() => {
		dispatch(getUserAsync({ planId }));
	}, [dispatch]);

	return (
		<>
			<Container className="d-flex vh-100 justify-content-center align-items-center flex-column">
				<h2 className="fw-bold">ProPlanner</h2>
				<div className="d-flex gap-4">
					<Card
						className="mt-4 p-4"
						style={{ width: '500px', height: '500px' }}
					>
						<UserList />
					</Card>
					<Card
						className="mt-4 p-4"
						style={{ width: '400px', height: '200px' }}
					>
						<AddUserForm />
					</Card>
				</div>
			</Container>
		</>
	);
};

export default UserSelectionPage;
