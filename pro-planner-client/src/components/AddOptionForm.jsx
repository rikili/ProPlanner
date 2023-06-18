import React, {useState} from 'react';
import {Modal, Button, Form} from "react-bootstrap";
import {useDispatch} from 'react-redux';
import {addOption} from "../redux/pollSlice";

function AddOptionForm({pollId, showModal, setShowModal}) {
    const [newOption, setNewOption] = useState("")
    const dispatch = useDispatch();

    let formResult = {
        pollId: pollId,
        option: newOption,
        voteCount: 0,
    }

    const handleSaveOption = () => {
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
                <Modal.Title>Add New Option</Modal.Title>
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
                <Button onClick={handleSaveOption}>
                    Add Option
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddOptionForm;