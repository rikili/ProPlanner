import React from 'react';
import Options from "./Options";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useState} from 'react';
import AddOptionForm from "./AddOptionForm";
import {BiCaretDown, BiCaretUp} from "react-icons/bi";
import {useDispatch} from 'react-redux';
import {voteOption} from "../redux/pollSlice";


function Poll({poll}) {

    const [showModal, setShowModal] = useState(false);
    const [isOptionListDisplay, setIsOptionListDisplay] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const dispatch = useDispatch();

    const caretIconSize = 25;

    const handleAddOption = () => {
        setShowModal(true);
    };

    const handleIconClick = () => {
        if (!isOptionListDisplay) {
            setIsOptionListDisplay(true);
        } else {
            setIsOptionListDisplay(false);
        }
    }

    // const userId = "user"; TODO... userID from backend

    let formResult = {
        pollId: poll.pollId,
        selectedOptions: selectedOptions,
        // userId: userId TODO...
    }

    const handleVote = () => {
        // TODO... implement error message if user has already voted
        dispatch(voteOption(formResult))
    }

    return (
        <>
            <Card className='mt-4 p-4'
                  style={{width: '700px'}}>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col>
                                <Card.Title>
                                    {poll.question}
                                </Card.Title>
                            </Col>
                            <Col className="d-flex justify-content-end">
                                {!isOptionListDisplay &&
                                    (<BiCaretDown size={caretIconSize}
                                                  onClick={handleIconClick}
                                    />)
                                }
                                {isOptionListDisplay &&
                                    (<BiCaretUp size={caretIconSize}
                                                onClick={handleIconClick}
                                    />)
                                }
                            </Col>
                        </Row>
                    </Container>
                    {isOptionListDisplay && (
                        <>
                            <Options style={{marginTop: '10px'}}
                                     poll={poll}
                                     setSelectedOptions={setSelectedOptions}
                                     selectedOptions={selectedOptions}
                            />
                            <Button style={{marginTop: '10px'}}
                                    variant="primary"
                                    size='sm'
                                    onClick={handleAddOption}>
                                Add New Option
                            </Button>{' '}
                            <Button style={{marginTop: '10px'}}
                                    variant="primary"
                                    size='sm'
                                    onClick={handleVote}>
                                Vote
                            </Button>
                        </>
                    )}
                </Card.Body>
            </Card>
            <AddOptionForm poll={poll}
                           showModal={showModal}
                           setShowModal={setShowModal}
            />
        </>
    );
}

export default Poll;