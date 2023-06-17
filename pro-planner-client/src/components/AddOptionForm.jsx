import React, {useState} from 'react';
import {Modal, Button, Form} from "react-bootstrap";

function AddOptionForm({showModal, setShowModal}) {
    const [newOption, setNewOption] = useState("")

    const handleSaveOption = () => {
        // TODO...
        console.log(newOption);

        handleCloseModal();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewOption("");
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
                        onChange={(e) => setNewOption(e.target.value)}
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