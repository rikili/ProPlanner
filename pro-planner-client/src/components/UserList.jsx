import React from 'react';
import {Button, Form} from "react-bootstrap";
import {useSelector, useDispatch} from 'react-redux';
import {selectUser, navigateToCreationPage} from '../redux/userSlice';

const UserList = () => {
    const userList = useSelector((state) => state.user.userList);
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const dispatch = useDispatch();


    if (!userList || userList.length === 0) {
        return <p>No User Yet</p>
    }

    const handleUserSelect = (user) => {
        dispatch(selectUser(user));
    };

    const handleContinueClick = () => {
        if (selectedUser) {
            dispatch(navigateToCreationPage());
        } else {
            console.log('Please select a user');
        }
    };

    return (
        <div>
            <p>Which one is you?</p>
            <Form>
                {userList.map((user) => (
                    <div key={user.userName}>
                        <Form.Check
                            type="radio"
                            id={user.userName}
                            label={user.userName}
                            checked={selectedUser === user}
                            onChange={() => handleUserSelect(user)}
                        />
                    </div>
                ))}
                <Button onClick={handleContinueClick}>
                    Continue
                </Button>
            </Form>
        </div>
    );
}

export default UserList;