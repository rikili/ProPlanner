import React from 'react';
import Poll from "./Poll";
import {Container} from "react-bootstrap";
import {useSelector} from 'react-redux';

function Polls() {

    const polls = useSelector((state) => state.poll.polls);

    return (
        <>
            <Container className='d-flex flex-column justify-content-center align-items-center'>
                {Object.entries(polls).map(([key, poll]) =>
                    <Poll poll={poll}
                          pollId={key}
                          key={key}
                    />)}
            </Container>
        </>
    );
}

export default Polls;

