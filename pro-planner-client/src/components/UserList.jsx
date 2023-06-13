import React from 'react';
import {Button, Form, ToggleButton} from "react-bootstrap";
import {useSelector, useDispatch} from 'react-redux';
import {selectUser} from '../redux/userSlice';
import {useNavigate} from "react-router-dom";
import {useParams} from 'react-router-dom';

import { setError, resetError } from '../redux/errorSlice';
import { ERR_TYPE } from '../constants';

const UserList = () => {
    const userList = useSelector((state) => state.user.userList);
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {tripId} = useParams();

    if (!userList || userList.length === 0) {
        return <p>No User Yet, Please add a user.</p>
    }

    const handleUserSelectChange = (user) => {
        dispatch(selectUser(user));
    };

    const handleContinueClick = () => {
        if (selectedUser) {
            dispatch(resetError());
            navigate(`/${tripId}`);
        } else {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Please select a user to continue.',
            }));
            return;
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
                                checked={selectedUser === user}
                                onChange={() => handleUserSelectChange(user)}
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