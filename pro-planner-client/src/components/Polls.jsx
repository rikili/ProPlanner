import React, {useEffect} from 'react';
import Poll from "./Poll";
import {Container} from "react-bootstrap";
import {useDispatch, useSelector} from 'react-redux';
import {getPollAsync} from "../redux/pollSlice";

function Polls({tripId}) {

    const pollList = useSelector((state) => Object.values(state.poll.polls));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPollAsync({tripId}))
    }, [dispatch])

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

