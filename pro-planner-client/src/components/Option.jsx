import React from 'react';
import {Col, Container, Form, ProgressBar, Row} from "react-bootstrap";
import {useSelector} from 'react-redux';

function Option({option, poll, setSelectedOption}) {

    const polls = useSelector((state) => Object.values(state.poll.polls))
    const currPoll = polls.find((p) => p.pollId === poll.pollId);
    const currPollOptions = Object.values(currPoll.options)

    const currUser = 'User A'; // TODO: fetch current user

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.id);

    }

    const isOptionDisabled = (optionId) => {
        const votedUser = currPoll.votedUsers.find((u) => u.user === currUser);

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
                            disabled={isOptionDisabled(option.optionId)}
                            type={'radio'}
                            label={option.option}
                            name={poll.pollId}
                            id={option.optionId}
                            key={option.optionId}
                            onChange={handleRadioChange}
                        />
                    </Col>
                    <Col className="d-flex justify-content-end">
                        {currPollOptions.find((o) => o.optionId === option.optionId).voteCount}
                    </Col>
                    <Col>
                        <ProgressBar
                            now={currPollOptions.find((o) => o.optionId === option.optionId).voteCount}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Option;


