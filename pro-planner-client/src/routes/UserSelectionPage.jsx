import React from 'react';
import {useState} from "react";
import UserData from "../data/UserData";
import UserList from "./UserList";
import AddUserForm from "./AddUserForm";
import {Card, Container} from 'react-bootstrap';

function UserSelectionPage() {
    const [userList, setUserList] = useState(UserData)
    const [selectedUser, setSelectedUser] = useState(null)
    const addNewUser = (newUser) => {
        setUserList([...userList, newUser])
    }

    return (
        <div>
            <Container className='d-flex vh-100 justify-content-center align-items-center'>
                <Card className='mt-3 p-3'>
                    <UserList userList={userList} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
                    <AddUserForm handleAdd={addNewUser}/>
                </Card>
            </Container>
        </div>
    );
}

export default UserSelectionPage;