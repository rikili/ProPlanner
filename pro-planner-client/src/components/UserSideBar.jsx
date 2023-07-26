import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';

const UserSideBar = props => {
	const userList = useSelector(state => state.user.userList);
	const loggedInUser = useSelector(state => state.user.selectedUser);
	const selectedUser = props.selectedUser;
	const setSelectedUser = props.setSelectedUser;
	const isEditing = props.isEditing;

	return (
		<div className="d-flex flex-column justify-content-center align-items-center mt-4">
			<Card className="mt-2" style={{ width: '350px' }}>
				<Card.Header as="h4" className="text-center">
					Responders
				</Card.Header>
				<Card.Body>
					<ListGroup
						variant="flush"
						style={{ maxHeight: '300px', overflow: 'scroll' }}
					>
						{isEditing ? (
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
									active={selectedUser == loggedInUser}
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
											>
												{user}
											</ListGroup.Item>
										)
								)}
							</>
						)}
					</ListGroup>
				</Card.Body>
				<Card.Footer>
					<Row>
						<Col as="h5" xs={8}>
							{' '}
							Finalized Date:{' '}
						</Col>
						<Col as="h5" className="text-end">
							{' '}
							N/A{' '}
						</Col>
					</Row>
				</Card.Footer>
			</Card>
		</div>
	);
};

export default UserSideBar;
