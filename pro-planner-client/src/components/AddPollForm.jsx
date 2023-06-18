import React, {useState} from 'react';
import {InputGroup, Button, Form, Card, Container} from "react-bootstrap";
import {v4 as uuidv4} from 'uuid';
import {useDispatch} from 'react-redux';
import {addPoll} from "../redux/pollSlice";

function AddPollForm() {
    const [newQuestion, setNewQuestion] = useState('')
    const dispatch = useDispatch();

    let formResult = {
        pollId: uuidv4(),
        question: newQuestion,
        options: [],
        votedUsers: {}
    }

    const handleAddPoll = (e) => {
        e.preventDefault();
        dispatch(addPoll(formResult))
        setNewQuestion('')
    }

    const handleQuestionChange = (e) => {
        setNewQuestion(e.target.value);
    }

    return (
        <>
            <Container className='d-flex flex-column mt-4 justify-content-center align-items-center'>
                <Card className='mt-4 p-4 d-flex' style={{width: '700px', height: '90px'}}>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Poll Question"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={handleQuestionChange}
                            value={newQuestion}
                        />
                        <Button variant="outline-primary"
                                id="button-addon2"
                                type='submit'
                                onClick={handleAddPoll}>
                            Add
                        </Button>
                    </InputGroup>
                </Card>
            </Container>
        </>
    );
}

export default AddPollForm;