import React from 'react';
import {Button, Form, ToggleButton} from "react-bootstrap";
import {useSelector, useDispatch} from 'react-redux';
import {selectUser} from '../redux/userSlice';
import {useNavigate} from "react-router-dom";
import { useParams } from 'react-router-dom';

const UserList = () => {
    const userList = useSelector((state) => state.user.userList);
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tripId } = useParams();

    if (!userList || userList.length === 0) {
        return <p>No User Yet</p>
    }

    const handleUserSelect = (user) => {
        dispatch(selectUser(user));
    };

    const handleContinueClick = () => {
        if (selectedUser) {
            navigate(`/${tripId}`);
        } else {
            alert('Please select a user');
        }
    };

    return (
        <>
            <Form>
                <Form.Label>Which one is you?</Form.Label>
                <div style={{width: '100%'}}>
                    {userList.map((user) => (
                        <div key={user}>
                            <ToggleButton
                                style={{width: '100%'}}
                                className="mb-2"
                                variant="outline-secondary"
                                type="checkbox"
                                id={user}
                                checked={selectedUser === user} onChange={() => handleUserSelect(user)}
                                value={user}
                            >
                                {user}
                            </ToggleButton>
                        </div>
                    ))}
                </div>
                <Button style={{width: '100%'}}
                    onClick={handleContinueClick}>
                    Continue
                </Button>
            </Form>
        </>
    );
}

export default UserList;