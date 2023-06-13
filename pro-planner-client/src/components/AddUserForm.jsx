import React from 'react';
import {useState} from "react";
import {Button, Form,} from "react-bootstrap";
import {addUser} from "../redux/userSlice";
import { useDispatch, useSelector } from 'react-redux';

import { setError, resetError } from '../redux/errorSlice';
import { ERR_TYPE } from '../constants';

const MAX_NAME_LIMIT = 45;
const NAME_CHECK_REGEX = /[^0-9a-zA-Z\s]+/g;

const AddUserForm = () => {
    const [userName, setUserName] = useState('');
    const users = useSelector(state => state.user.userList);
    const dispatch = useDispatch();

    const handleUserNameChange = (e) => {
        const inputVal = e.target.value;
        if (inputVal.length >= MAX_NAME_LIMIT) {
            setUserName(inputVal.slice(0, MAX_NAME_LIMIT));
        } else {
            setUserName(e.target.value);
        }
    }

    const handleNewUserSubmit = (e) => {
        e.preventDefault();
        if (!userName) {
            return;
        }
        const formattedName = userName.trim();
        console.log(formattedName);
        if (formattedName.length === 0) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Username is invalid. Name must contain at least one character.',
            }));
            return;
        }
        if (formattedName.length > MAX_NAME_LIMIT) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: `Username is invalid. Name must not exceed ${MAX_NAME_LIMIT} characters.`,
            }));
            return;
        }
        if (userName.match(NAME_CHECK_REGEX)) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Username is invalid. Invalid characters detected. Please use only alphanumeric characters.',
            }));
            return;
        }
        if (users.includes(formattedName)) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Username is taken, please submit a unique username.',
            }));
            return;
        }
        dispatch(resetError());
        dispatch(addUser(formattedName));
        setUserName('');
    }

    return (
        <>
            <Form onSubmit={handleNewUserSubmit}>
                <Form.Label>Not There? Create a new User</Form.Label>
                <div>
                    <input
                        style={{width: '100%', height: '40px'}}
                        type='text'
                        placeholder='Name of new user'
                        value={userName}
                        onChange={handleUserNameChange}/>
                </div>
                <div>
                    <Button className='mt-3' type='submit' style={{width: '100%'}}>
                        Submit
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default AddUserForm;