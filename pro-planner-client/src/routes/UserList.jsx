import React from 'react';
import {Button, Form} from "react-bootstrap";

function UserList({userList, selectedUser, setSelectedUser}) {
    if (!userList || userList.length === 0) {
        return <p>No User Yet</p>
    }

    const handleUserSelect = (user) => {
        setSelectedUser(user);
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
                <Button
                    onClick={() => {
                        if (selectedUser) {
                            console.log("Navigate to creation page");
                        } else {
                            console.log("Please select a user");
                        }
                    }}
                >
                    Continue
                </Button>
            </Form>
        </div>
    );
}

export default UserList;