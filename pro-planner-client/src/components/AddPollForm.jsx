import React, {useState} from 'react';
import {InputGroup, Button, Form, Card, Container} from "react-bootstrap";
import {useDispatch, useSelector} from 'react-redux';
import {addPoll, addPollAsync} from "../redux/pollSlice";
import {resetError, setError} from "../redux/errorSlice";
import {ERR_TYPE} from "../constants";

const MAX_QUESTION_LIMIT = 105;

function AddPollForm() {
    const [newQuestion, setNewQuestion] = useState('')
    const polls = useSelector((state) => Object.values(state.poll.polls))
    const dispatch = useDispatch();

    const handleAddPoll = (e) => {
        e.preventDefault();
        const formattedNewQuestion = newQuestion.trim();

        if (formattedNewQuestion.length === 0) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Question is invalid. Question must contain at least one character.',
            }));
            return;
        }

        if (formattedNewQuestion.length > MAX_QUESTION_LIMIT) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: `Question is invalid. Question must not exceed ${MAX_QUESTION_LIMIT} characters.`,
            }));
            return;
        }

        if (polls.find(poll => poll.question === newQuestion)) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Poll already exists, please add a different poll.',
            }));
            return;
        }

        dispatch(resetError());
        dispatch(addPollAsync({newQuestion}))
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

