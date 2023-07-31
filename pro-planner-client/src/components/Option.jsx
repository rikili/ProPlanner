import React from 'react';
import {Col, Container, Form, ProgressBar, Row} from "react-bootstrap";

function Option({option, optionId, poll, pollId, currUser, setSelectedOption}) {

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.id);
    }

    const isOptionDisabled = (optionId) => {
        const votedUser = poll.votedUsers.find((u) => u.user === currUser);

        if (votedUser) {
            return votedUser.votedOptionId === optionId;
        }

        return false;
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Form.Check
                            disabled={isOptionDisabled(optionId)}
                            type={'radio'}
                            label={option.option}
                            name={pollId}
                            id={optionId}
                            onChange={handleRadioChange}
                        />
                    </Col>
                    <Col className="d-flex justify-content-end">
                        {poll.options[optionId].voteCount}
                    </Col>
                    <Col>
                        <ProgressBar
                            now={poll.options[optionId].voteCount}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Option;


