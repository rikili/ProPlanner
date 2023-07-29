import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {Container} from "react-bootstrap";
import UserExpense from "./UserExpense";
import {addUser} from "../redux/costSlice";

function TripExpense() {

    const users = useSelector((state) => state.cost.costs);
    const costDocumentID = useSelector((state) => state.cost.costsID);
    const currUser = useSelector((state) => state.user.selectedUser);
    const [currUserId, setCurrUserId] = useState(null);
    const dispatch = useDispatch();
    

    useEffect(() => {
        const findUserId = (userName) => {
            for (const key in users) {
                if (users[key].userName === userName) {
                    return key;
                }
            }
            return null;
        };

        const userExists = (currUser) => {
            for (const key in users) {
                if (users[key].userName === currUser) {
                    return true;
                }
            }
            return false;
        };

        if (!userExists(currUser)) {
            let userInfo = {
                id: currUser, //TODO: replace with mongo id
                name: currUser
            }
            dispatch(addUser(userInfo));
            setCurrUserId(userInfo.id)
        } else {
            setCurrUserId(findUserId(currUser))
        }
    }, [dispatch, currUser, users])


    return (
        <>
            <Container className='d-flex flex-column justify-content-center align-items-center mt-4'>
                {Object.entries(users).map(([key, user], index) =>
                    <UserExpense
                        user={user}
                        currUserId={currUserId}
                        userId={key}
                        key={key}
                    />
                )}
            </Container>
        </>
    );
}

export default TripExpense;
