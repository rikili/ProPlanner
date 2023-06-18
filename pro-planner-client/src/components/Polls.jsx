import React from 'react';
import Poll from "./Poll";
import {Container} from "react-bootstrap";
import {useSelector} from 'react-redux';

function Polls() {

    const pollList = useSelector((state) => state.poll.polls);

    return (
        <>
            <Container className='d-flex flex-column justify-content-center align-items-center'>
                {pollList.map((poll) =>
                    <Poll poll={poll}/>)}
            </Container>
        </>
    );
}

export default Polls;