import React from 'react';
import Poll from "./Poll";
import {Container} from "react-bootstrap";
import {useSelector} from 'react-redux';

function Polls() {

    const pollList = useSelector((state) => Object.values(state.poll.polls));

    return (
        <>
            <Container className='d-flex flex-column justify-content-center align-items-center'>
                {pollList.map((poll) =>
                    <Poll poll={poll}
                          key={poll.pollId}
                    />)}
            </Container>
        </>
    );
}

export default Polls;

