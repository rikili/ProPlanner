import { Col, Container, Form, ProgressBar, Row } from 'react-bootstrap';

function Option({ option, optionId, poll, pollId, currUser, setSelectedOption, userCount }) {
    const handleRadioChange = (e) => {
        setSelectedOption(e.target.id);
    };

    const isOptionDisabled = () => {
        return option.votedUsers.includes(currUser);
    };

    const percentageFull = Math.floor((poll.options[optionId].voteCount / userCount) * 100);

    return (
        <>
            <Container>
                <Row>
                    <Col xs={7}>
                        <Form.Check
                            disabled={isOptionDisabled()}
                            type={'radio'}
                            label={option.option}
                            name={pollId}
                            id={optionId}
                            onChange={handleRadioChange}
                        />
                    </Col>
                    <Col className="d-flex justify-content-end" xs={1}>
                        {poll.options[optionId].voteCount}
                    </Col>
                    <Col>
                        <ProgressBar now={percentageFull} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Option;
