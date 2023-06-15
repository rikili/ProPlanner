import React from 'react';
import Poll from "./Poll";
import {Container} from "react-bootstrap";
import initialState from "../redux/pollSlice";

function PollsList() {

    const pollList = initialState.pollList;

    return (
        <>
            <Container className='d-flex flex-column justify-content-center align-items-center'>
                {pollList.map((poll) =>
                    <Poll poll={poll}/>)}
            </Container>
        </>
    );
}

export default PollsList;