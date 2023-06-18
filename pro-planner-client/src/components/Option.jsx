import React from 'react';
import {Col, Container, Form, ProgressBar, Row} from "react-bootstrap";
import {useState} from "react";
import {useSelector} from 'react-redux';

function Option({option, poll, setSelectedOptions, selectedOptions}) {

    const [isChecked, setIsChecked] = useState(false);
    const currPoll = useSelector((state) =>
        state.poll.polls.find((p) => p.pollId === poll.pollId)
    );

    const handleRadioChange = () => {
        setIsChecked((prevState) => !prevState);
        if (!isChecked) {
            setSelectedOptions([...selectedOptions, option.optionId]);
        } else {
            setSelectedOptions(selectedOptions.filter((i) => i !== option.optionId));
        }
    };


    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Form.Check
                            type={'checkbox'}
                            id={'default-radio'}
                            checked={isChecked}
                            label={option.option}
                            key={option.optionId}
                            onChange={handleRadioChange}
                        />
                    </Col>
                    <Col className="d-flex justify-content-end">
                        {currPoll.options.find((o) => o.optionId === option.optionId).voteCount}
                    </Col>
                    <Col>
                        <ProgressBar
                            now={currPoll.options.find((o) => o.optionId === option.optionId).voteCount}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Option;