import React from 'react';
import {useSelector} from "react-redux";
import {Container} from "react-bootstrap";
import UserExpense from "./UserExpense";

function TripExpense() {

    const users = useSelector((state) => state.cost);


    return (
        <>
            <Container className='d-flex flex-column justify-content-center align-items-center mt-4'>
                {Object.entries(users).map(([key, user]) =>
                    <UserExpense
                        user={user}
                        userId={key}
                        key={key}
                    />
                )}
            </Container>
        </>
    );
}

export default TripExpense;
