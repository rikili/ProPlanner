import React from 'react';
import UserList from "./UserList";
import AddUserForm from "./AddUserForm";
import {Card, Container} from 'react-bootstrap';
import {addUser} from '../redux/userSlice';
import {useDispatch} from 'react-redux';

const UserSelectionPage = () => {
    const dispatch = useDispatch();

    const handleAddUser = (newUser) => {
        dispatch(addUser(newUser));
    };

    return (
        <div>
            <Container className='d-flex vh-100 justify-content-center align-items-center'>
                <Card className='mt-3 p-3'>
                    <UserList/>
                </Card>
                <Card className='mt-3 p-3'>
                    <AddUserForm handleAdd={handleAddUser}/>
                </Card>
            </Container>
        </div>
    );
}

export default UserSelectionPage;