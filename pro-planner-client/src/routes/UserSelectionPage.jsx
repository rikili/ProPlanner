import React from 'react';
import {useState} from "react";
import UserData from "../data/UserData";
import UserList from "./UserList";
import AddUserForm from "./AddUserForm";

function UserSelectionPage() {
    const [userList, setUserList] = useState(UserData)
    const addNewUser = (newUser) => {
        // adds new user to the end of the list
        setUserList([...userList, newUser])
    }

    return (
        <div>
            <UserList userList={userList}/>
            <AddUserForm handleAdd={addNewUser}/>
        </div>
    );
}

export default UserSelectionPage;