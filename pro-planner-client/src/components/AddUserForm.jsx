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
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Label>Not There? Create a new User</Form.Label>
                <div>
                    <input
                        style={{width: '100%', height: '40px'}}
                        type='text'
                        placeholder='Name of new user'
                        value={userName}
                        onChange={handleAddUser}/>
                </div>
                <div>
                    <Button className='mt-3' type='submit' style={{width: '100%'}}>
                        Submit
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default AddUserForm;