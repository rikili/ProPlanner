import React from 'react';
import Poll from "./Poll";
import {Container} from "react-bootstrap";

function Polls({polls}) {

    if (polls === null || !polls) {
        return;
    }


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

