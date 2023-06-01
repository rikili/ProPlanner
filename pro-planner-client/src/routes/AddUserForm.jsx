import React from 'react';
import {useState} from "react";

function AddUserForm( {handleAdd} ) {
    const [userName, setUserName] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(true)

    // update userName(state)
    const handleUserNameChange = (e) => {
        if (userName === '' && userName.trim().length === 0) {
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)
        }
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
            <form onSubmit={handleSubmit}>
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
                    <button type='submit'>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddUserForm;