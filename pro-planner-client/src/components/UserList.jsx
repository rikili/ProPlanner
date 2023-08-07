import { useSelector, useDispatch } from 'react-redux';
import { deleteUsersAsync, resetUser, selectUser } from '../redux/userSlice';
import { updatePollAsync } from '../redux/pollSlice';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Form, ToggleButton, Col, Row } from 'react-bootstrap';
import { MdModeEditOutline } from 'react-icons/md';
import { RiCheckFill } from 'react-icons/ri';
import { RiCloseFill } from 'react-icons/ri';
import { setError, resetError } from '../redux/errorSlice';
import { ERR_TYPE } from '../constants';
import { useState } from 'react';
import { updateCostAsync } from '../redux/costSlice';
import Button from './override/Button';
import './UserList.scss';

const UserList = () => {
    const userList = useSelector((state) => state.user.userList);
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tripId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [usersToDelete, setUsersToDelete] = useState([]);
    const pollDocumentId = useSelector((state) => state.poll.pollsId);

    if (!userList || userList.length === 0) {
        return <p>No User Yet, Please add a user.</p>;
    }

    const handleUserSelectChange = (user) => {
        dispatch(selectUser(user));
    };

    const handleContinueClick = () => {
        if (selectedUser) {
            dispatch(resetError());
            navigate(`/${tripId}`);
        } else {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Please select a user to continue.',
                })
            );
            return;
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    const handleDelete = (userToDelete) => {
        if (usersToDelete.includes(userToDelete)) {
            // If the userToDelete is already in the usersToDelete list, remove it
            const updatedUsersToDelete = usersToDelete.filter((user) => user !== userToDelete);
            setUsersToDelete(updatedUsersToDelete);
        } else {
            // If the userToDelete is not in the usersToDelete list, add it
            setUsersToDelete([...usersToDelete, userToDelete]);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setUsersToDelete([]);
    };

    const handleConfirm = () => {
        if (usersToDelete.length !== 0) {
            dispatch(deleteUsersAsync({ planId: tripId, usersToDelete }));
            pollDocumentId && dispatch(updatePollAsync({ pollDocumentId, usersToDelete }));
            dispatch(updateCostAsync({ planId: tripId, usersToDelete }));
            dispatch(resetUser());
        }
        setUsersToDelete([]);
        setIsEditing(false);
    };

    return (
        <>
            <Form>
                <div style={{ width: '100%' }}>
                    <Row>
                        <Col>
                            {!isEditing && <Form.Label>Which one is you?</Form.Label>}
                            {isEditing && <Form.Label>Choose Users to delete</Form.Label>}
                        </Col>
                        {!isEditing && (
                            <Col xs={2} sm={2} md={2} lg={2} style={{ width: '12%' }}>
                                <button className="edit-button" onClick={toggleEdit}>
                                    <MdModeEditOutline />
                                </button>
                            </Col>
                        )}
                        {isEditing && (
                            <div style={{ width: '12%' }} className="control-layer">
                                <button className="control-button confirm" onClick={handleConfirm}>
                                    <RiCheckFill />
                                </button>
                                <button className="control-button close" onClick={handleCancel}>
                                    <RiCloseFill />
                                </button>
                            </div>
                        )}
                    </Row>
                    {!isEditing &&
                        userList.map((user) => (
                            <div key={user}>
                                <ToggleButton
                                    style={{ width: '100%' }}
                                    className="mb-2"
                                    variant="outline-secondary"
                                    type="checkbox"
                                    id={user}
                                    checked={selectedUser === user}
                                    onChange={() => handleUserSelectChange(user)}
                                    value={user}>
                                    {user}
                                </ToggleButton>
                            </div>
                        ))}
                    {isEditing &&
                        userList.map((user) => (
                            <div key={user}>
                                <Button
                                    style={{ width: '100%' }}
                                    className="mb-2"
                                    variant="outline-danger"
                                    id={user}
                                    active={usersToDelete.includes(user)}
                                    onClick={() => handleDelete(user)}
                                    value={user}>
                                    {user}
                                </Button>
                            </div>
                        ))}
                </div>
                {!isEditing && (
                    <Button
                        style={{ width: '100%' }}
                        variant="custom-primary"
                        onClick={handleContinueClick}>
                        Continue
                    </Button>
                )}
            </Form>
        </>
    );
};

export default UserList;
