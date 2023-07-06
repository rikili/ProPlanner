import React from 'react';
import {useSelector} from "react-redux";
import {Container} from "react-bootstrap";
import UserExpense from "./UserExpense";

function TripExpense() {

    const users = useSelector((state) => Object.values(state.cost.users));


    return (
        <>
            <Container className='d-flex flex-column justify-content-center align-items-center mt-4'>
                {users.map((user) =>
                <UserExpense
                    user={user}
                />
                )}
            </Container>
        </>
    );
}

export default TripExpense;
