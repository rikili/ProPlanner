import React, { useEffect } from 'react';
import UserList from '../components/UserList';
import AddUserForm from '../components/AddUserForm';
import { Card, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { getUserAsync } from '../redux/userSlice';
import './UserSelectionPage.scss';

const UserSelectionPage = () => {
	const dispatch = useDispatch();

	const planId = useLocation().pathname.split('/')[2];
	useEffect(() => {
		dispatch(getUserAsync({ planId }));
	}, [dispatch]);

	return (
		<>
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
