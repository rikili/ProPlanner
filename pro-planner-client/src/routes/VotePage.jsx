import { useEffect } from 'react';
import { getPollAsync } from '../redux/pollSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Container } from 'react-bootstrap';
import AddPollForm from '../components/AddPollForm';
import Polls from '../components/Polls';

const VotePage = () => {
    const planId = useLocation().pathname.split('/')[1];
    const polls = useSelector((state) => state.poll.polls);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPollAsync({ planId }));
    }, [dispatch]);

    return (
        <>
            <Container className="d-flex flex-column mt-4 align-items-center">
                <AddPollForm polls={polls} />
                <Polls polls={polls} />
            </Container>
        </>
    );
};

export default VotePage;
