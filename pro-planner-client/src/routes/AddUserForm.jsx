import React from 'react';
import {useState} from "react";
import {Button, Form, } from "react-bootstrap";

function AddUserForm({handleAdd}) {
    const [userName, setUserName] = useState('')

    const handleUserNameChange = (e) => {
        setUserName(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (userName !== '' && userName.trim().length > 0) {
            const newUser = {
                userName
            }

            handleAdd(newUser)

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
                    <input onChange={handleUserNameChange}
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