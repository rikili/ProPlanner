import React, {useState} from 'react';
import {Modal, Form} from "react-bootstrap";
import Button from './override/Button';
import {useDispatch, useSelector} from 'react-redux';
import {addOptionAsync} from "../redux/pollSlice";
import {resetError, setError} from "../redux/errorSlice";
import {ERR_TYPE} from "../constants";

const MAX_OPTION_LIMIT = 70;

function AddOptionForm({poll, pollId, showModal, setShowModal}) {
    const [newOption, setNewOption] = useState("")
    const dispatch = useDispatch();
    const pollDocumentId = useSelector((state) => state.poll.pollsId)

    const handleAddOption = (e) => {
        e.preventDefault();
        const formattedNewOption = newOption.trim();
        const options = poll.options || {};

        if (formattedNewOption.length === 0) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Option is invalid. Option must contain at least one character.',
            }));
            return;
        }

        if (formattedNewOption.length > MAX_OPTION_LIMIT) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: `Option is invalid. Option must not exceed ${MAX_OPTION_LIMIT} characters.`,
            }));
            return;
        }

        const optionsArray = Object.values(options);

        if (optionsArray.find(option => option.option === newOption)) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Option already exists, please add a different option.',
            }));
            return;
        }

        dispatch(resetError());
        dispatch(addOptionAsync({newOption, pollDocumentId, pollId}));
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
                        variant="custom-primary"
                        onClick={handleAddOption}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddOptionForm;

