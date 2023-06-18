import React from 'react';
import {Col, Container, Form, ProgressBar, Row} from "react-bootstrap";
import {useState} from "react";
import {useSelector} from 'react-redux';

function Option({option, pollId, index, setSelectedOptions, selectedOptions}) {

    const [isChecked, setIsChecked] = useState(false);
    const poll = useSelector((state) =>
        state.poll.polls.find((poll) => poll.id === pollId)
    );

    const handleRadioChange = () => {
        setIsChecked((prevState) => !prevState);
        if (!isChecked) {
            setSelectedOptions([...selectedOptions, index]);
        } else {
            setSelectedOptions(selectedOptions.filter((item) => item !== index));
        }
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Form.Check
                            type={'radio'}
                            id={'default-radio'}
                            checked={isChecked}
                            label={option.option}
                            onClick={handleRadioChange}
                        />
                    </Col>
                    <Col>
                        <ProgressBar now={poll.options[index].voteCount}
                                     label={`${poll.options[index].voteCount}`}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Option;