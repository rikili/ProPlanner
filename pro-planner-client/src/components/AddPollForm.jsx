import React, {useState} from 'react';
import {InputGroup, Form, Card} from "react-bootstrap";
import Button from './override/Button';
import {useDispatch, useSelector} from 'react-redux';
import {addPollAsync} from "../redux/pollSlice";
import {resetError, setError} from "../redux/errorSlice";
import {ERR_TYPE} from "../constants";

const MAX_QUESTION_LIMIT = 105;

function AddPollForm({polls}) {
    const [newQuestion, setNewQuestion] = useState('')
    const currPolls = polls || {};
    const pollDocumentId = useSelector((state) => state.poll.pollsId)
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

        const pollsArray = Object.values(currPolls);

        if (pollsArray.find(poll => poll.question === newQuestion)) {
            dispatch(setError({
                errType: ERR_TYPE.ERR,
                message: 'Poll already exists, please add a different poll.',
            }));
            return;
        }

        dispatch(resetError());
        dispatch(addPollAsync({newQuestion, pollDocumentId}))
        setNewQuestion('')
    }

    const handleQuestionChange = (e) => {
        setNewQuestion(e.target.value);
    }

    return (
        <>
            <Card className='mt-4 p-4 d-flex' style={{maxWidth: '700px', width: '100%', height: '90px'}}>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Poll Question"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        onChange={handleQuestionChange}
                        value={newQuestion}
                    />
                    <Button variant="custom-outline-primary"
                            id="button-addon2"
                            type='submit'
                            onClick={handleAddPoll}>
                        Add
                    </Button>
                </InputGroup>
            </Card>
        </>
    );
}

export default AddPollForm;

