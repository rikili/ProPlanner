import React from 'react';
import Options from "./Options";
import {Accordion} from "react-bootstrap";
import Button from './override/Button';
import {useState} from 'react';
import AddOptionForm from "./AddOptionForm";
import {useDispatch, useSelector} from 'react-redux';
import {voteOptionAsync} from "../redux/pollSlice";
import {resetError, setError} from "../redux/errorSlice";
import {ERR_TYPE} from "../constants";
import './Poll.scss';

function Poll({poll, pollId}) {

    const currUser = useSelector((state) => state.user.selectedUser);
    const users = useSelector((state) => state.user.userList);
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
            <Accordion className='mt-2 p-2' style={{maxWidth: '700px', width: '100%'}}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header className="poll-header">{poll.question}</Accordion.Header>
                    <Accordion.Body>
                        <Options style={{marginTop: '10px'}}
                                 poll={poll}
                                 pollId={pollId}
                                 currUser={currUser}
                                 userCount={users.length}
                                 setSelectedOption={setSelectedOption}
                                 selectedOption={selectedOption}
                        />
                        <Button style={{marginTop: '10px'}}
                                variant="custom-primary"
                                size='sm'
                                onClick={handleAddOption}>
                            Add Option
                        </Button>{' '}
                        <Button style={{marginTop: '10px'}}
                                variant="custom-primary"
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

