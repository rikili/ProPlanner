import React from 'react';
import Options from "./Options";
import {Button, Accordion} from "react-bootstrap";
import {useState} from 'react';
import AddOptionForm from "./AddOptionForm";
import {useDispatch, useSelector} from 'react-redux';
import {voteOptionAsync} from "../redux/pollSlice";
import {resetError, setError} from "../redux/errorSlice";
import {ERR_TYPE} from "../constants";


function Poll({poll, pollId}) {

    // const currUser = 'user1'; // testing purpose
    const currUser = useSelector((state) => state.user.selectedUser);
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const dispatch = useDispatch();
    const pollDocumentId = useSelector((state) => state.poll.pollsId);

    const handleAddOption = () => {
        setShowModal(true);
    };

    const handleVote = () => {
        if (selectedOption.length === 0) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Option not selected. Please select an option to vote.',
            }));
            return;
        }

        dispatch(resetError());

        const votedUser = poll.votedUsers.find((u) => u.user === currUser);

        dispatch(voteOptionAsync({
            currUser: currUser,
            votedOptionId: votedUser ? votedUser.votedOptionId : null,
            newVotedOptionId: selectedOption,
            pollDocumentId: pollDocumentId,
            pollId: pollId
        }))
    }

    return (
        <>
            <Accordion className='mt-2 p-2'>
                <Accordion.Item eventKey="0"
                                style={{width: '700px'}}>
                    <Accordion.Header>{poll.question}</Accordion.Header>
                    <Accordion.Body>
                        <Options style={{marginTop: '10px'}}
                                 poll={poll}
                                 pollId={pollId}
                                 currUser={currUser}
                                 setSelectedOption={setSelectedOption}
                                 selectedOption={selectedOption}
                        />
                        <Button style={{marginTop: '10px'}}
                                variant="primary"
                                size='sm'
                                onClick={handleAddOption}>
                            Add Option
                        </Button>{' '}
                        <Button style={{marginTop: '10px'}}
                                variant="primary"
                                size='sm'
                                onClick={handleVote}>
                            Vote
                        </Button>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <AddOptionForm poll={poll}
                           pollId={pollId}
                           showModal={showModal}
                           setShowModal={setShowModal}
            />
        </>
    );
}

export default Poll;

