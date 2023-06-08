import React from 'react';
import {useState} from "react";
import {Button, Form,} from "react-bootstrap";
import {addUser} from "../redux/userSlice";
import {useDispatch} from 'react-redux';

const AddUserForm = () => {
    const [userName, setUserName] = useState('')
    const dispatch = useDispatch();

    const handleAddUser = (e) => {
        setUserName(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (userName !== '' && userName.trim().length > 0) {

            dispatch(addUser(userName))

            setUserName('')
        }

    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <p>
                    Not There? Create a new User
                </p>
                <div>
                    <input onChange={handleAddUser}
                           type='text'
                           placeholder='Name of new user'
                           value={userName}/>
                </div>
                <div>
                    <Button className='mt-3' type='submit'>
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default AddUserForm;