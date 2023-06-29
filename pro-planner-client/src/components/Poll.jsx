import React from 'react';
import Options from "./Options";
import {Button, Accordion} from "react-bootstrap";
import {useState} from 'react';
import AddOptionForm from "./AddOptionForm";
import {useDispatch} from 'react-redux';
import {voteOption} from "../redux/pollSlice";
import {resetError, setError} from "../redux/errorSlice";
import {ERR_TYPE} from "../constants";


function Poll({poll}) {

    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const dispatch = useDispatch();

    const handleAddOption = () => {
        setShowModal(true);
    };

    const currUser = 'User A'; // TODO: fetch current user

    let formResult = {
        pollId: poll.pollId,
        selectedOption: selectedOption, // selected option ID
        user: currUser,
    }

    const handleVote = () => {
        if (selectedOption.length === 0) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Option(s) not selected. Please select at least one option to vote.',
            }));
            return;
        }

        dispatch(resetError());
        dispatch(voteOption(formResult))
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
                           showModal={showModal}
                           setShowModal={setShowModal}
            />
        </>
    );
}

export default Poll;

