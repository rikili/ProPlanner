import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const UserSideBar = ({ isEditMode, selectedUser, setSelectedUser }) => {
	const userList = useSelector(state => state.user.userList);
	const loggedInUser = useSelector(state => state.user.selectedUser);

	return (
		<div className="d-flex flex-column justify-content-center align-items-center">
			<Card className="details-card summary-list">
				<Card.Header className="summary-body text-center">
					<b>Responders</b>
				</Card.Header>
				<Card.Body className="summary-body">
					<ListGroup
						variant="flush"
						style={{ maxHeight: '300px', overflow: 'scroll' }}
					>
						{isEditMode ? (
							<>
								<ListGroup.Item className="text-center" disabled as="h6">
									All Users
								</ListGroup.Item>
								<ListGroup.Item className="text-center" active>
									{loggedInUser}
								</ListGroup.Item>
								{userList.map(
									user =>
										loggedInUser !== user && (
											<ListGroup.Item
												className="text-center"
												active={user === loggedInUser}
												disabled={user !== loggedInUser}
												key={user}
											>
												{user}
											</ListGroup.Item>
										)
								)}
							</>
						) : (
							<>
								<ListGroup.Item
									className="text-center"
									onClick={() => setSelectedUser(null)}
									active={!selectedUser}
									as="h6"
								>
									All Users
								</ListGroup.Item>
								<ListGroup.Item
									className="text-center"
									onClick={() => setSelectedUser(loggedInUser)}
									active={selectedUser === loggedInUser}
								>
									{loggedInUser}
								</ListGroup.Item>
								{userList.map(
									user =>
										loggedInUser !== user && (
											<ListGroup.Item
												className="text-center"
												onClick={() => setSelectedUser(user)}
												active={user === selectedUser}
												key={user}
											>
												{user}
											</ListGroup.Item>
										)
								)}
							</>
						)}
					</ListGroup>
				</Card.Body>
			</Card>
		</div>
	);
};

export default UserSideBar;
