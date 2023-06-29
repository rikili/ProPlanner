import React, {useState} from 'react';
import {Modal, Button, Form} from "react-bootstrap";
import {useDispatch} from 'react-redux';
import {addOption} from "../redux/pollSlice";
import {v4 as uuidv4} from 'uuid';
import {resetError, setError} from "../redux/errorSlice";
import {ERR_TYPE} from "../constants";

function AddOptionForm({poll, showModal, setShowModal}) {
    const [newOption, setNewOption] = useState("")
    const dispatch = useDispatch();

    let formResult = {
        pollId: poll.pollId,
        optionId: uuidv4(),
        option: newOption,
        voteCount: 0,
    }

    const handleAddOption = (e) => {
        e.preventDefault();
        const formattedNewOption = newOption.trim();

        if (formattedNewOption.length === 0) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                disableControl: true,
                message: 'Option is invalid. Option must contain at least one character.',
            }));
            return;
        }

        if (poll.options.find(option => option.option === newOption)) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                disableControl: true,
                message: 'Option already exists, please add a different option.',
            }));
            return;
        }

        dispatch(resetError());
        dispatch(addOption(formResult));
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewOption("");
    }


    const handleOptionChange = (e) => {
        setNewOption(e.target.value)
    }

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add Option</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Enter new option"
                        value={newOption}
                        onChange={handleOptionChange}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit'
                        onClick={handleAddOption}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddOptionForm;

