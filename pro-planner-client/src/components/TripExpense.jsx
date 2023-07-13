import React, {useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {Container} from "react-bootstrap";
import UserExpense from "./UserExpense";
import {addUser} from "../redux/costSlice";

function TripExpense() {

    const users = useSelector((state) => state.cost);
    const currUser = "user2" //TODO: fetch selectedUser
    const dispatch = useDispatch();
    const userExists = (currUserId) => {
        return currUserId in users;
    }

    useEffect(() => {
        if (!userExists(currUser)) {
            let userInfo = {
                id: currUser, //TODO: replace with mongo id
                name: currUser
            }
            dispatch(addUser(userInfo));
        }
    }, [currUser])


    return (
        <>
            <Container className='d-flex flex-column justify-content-center align-items-center mt-4'>
                {Object.entries(users).map(([key, user]) =>
                    <UserExpense
                        user={user}
                        currUserId={currUser}
                        userId={key}
                        key={key}
                    />
                )}
            </Container>
        </>
    );
}

export default TripExpense;
