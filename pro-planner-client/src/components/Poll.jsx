import { Accordion, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePollAsync, voteOptionAsync } from '../redux/pollSlice';
import { resetError, setError } from '../redux/errorSlice';
import { ERR_TYPE } from '../constants';
import Options from './Options';
import AddOptionForm from './AddOptionForm';
import Button from './override/Button';
import './Poll.scss';

function Poll({ poll, pollId }) {
    const currUser = useSelector((state) => state.user.selectedUser);
    const users = useSelector((state) => state.user.userList);
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const dispatch = useDispatch();
    const pollDocumentId = useSelector((state) => state.poll.pollsId);

    const handleClose = () => setShowDeleteConfirmation(false);

    const handleAddOption = () => {
        setShowModal(true);
    };

    const handleVote = () => {
        if (selectedOption.length === 0) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Option not selected. Please select an option to vote.',
                })
            );
            return;
        }

        dispatch(resetError());

        let votedOptionId = null;

        for (const optionId in poll.options) {
            if (poll.options[optionId].votedUsers.includes(currUser)) {
                votedOptionId = optionId;
                break;
            }
        }

        dispatch(
            voteOptionAsync({
                currUser: currUser,
                votedOptionId: votedOptionId,
                newVotedOptionId: selectedOption,
                pollDocumentId: pollDocumentId,
                pollId: pollId,
            })
        );
    };

    const handleConfirmationModal = () => {
        setShowDeleteConfirmation(true);
    };

    const handleDelete = () => {
        dispatch(
            deletePollAsync({
                pollDocumentId: pollDocumentId,
                pollId: pollId,
            })
        );
    };

    return (
        <>
            <Accordion className="mt-2 p-2" style={{ maxWidth: '700px', width: '100%' }}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header className="poll-header">{poll.question}</Accordion.Header>
                    <Accordion.Body>
                        <Options
                            style={{ marginTop: '10px' }}
                            poll={poll}
                            pollId={pollId}
                            currUser={currUser}
                            userCount={users.length}
                            setSelectedOption={setSelectedOption}
                            selectedOption={selectedOption}
                        />
                        <Button
                            style={{ marginTop: '10px' }}
                            variant="custom-primary"
                            size="sm"
                            onClick={handleAddOption}>
                            Add Option
                        </Button>{' '}
                        <Button
                            style={{ marginTop: '10px' }}
                            variant="custom-primary"
                            size="sm"
                            onClick={handleVote}>
                            Vote
                        </Button>{' '}
                        <Button
                            style={{ marginTop: '10px' }}
                            variant="custom-danger"
                            size="sm"
                            onClick={handleConfirmationModal}>
                            Delete Poll
                        </Button>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <AddOptionForm
                poll={poll}
                pollId={pollId}
                showModal={showModal}
                setShowModal={setShowModal}
            />
            <Modal show={showDeleteConfirmation} onHide={handleClose}>
                <Modal.Body>Do you want to delete the poll?</Modal.Body>
                <Modal.Footer>
                    <Button variant="custom-secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="custom-primary" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Poll;
