import React from 'react';
import OptionsList from "./OptionsList";
import {Button, Card} from "react-bootstrap";
import {useState} from 'react';
import AddOptionForm from "./AddOptionForm";
import {BiCaretDown, BiCaretUp} from "react-icons/bi";

function Poll({poll}) {

    const [showModal, setShowModal] = useState(false);
    const [isOptionListDisplay, setIsOptionListDisplay] = useState(false);

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

    return (
        <>
            <Card className='mt-4 p-4' style={{width: '700px'}}>
                <Card.Body>
                    <div className="d-flex align-items-center justify-content-between">
                        <Card.Title>{poll.question}</Card.Title>
                        {!isOptionListDisplay &&
                            (<BiCaretDown size={caretIconSize} onClick={handleIconClick}/>)
                        }
                        {isOptionListDisplay &&
                            (<BiCaretUp size={caretIconSize} onClick={handleIconClick}/>)
                        }
                    </div>
                    {isOptionListDisplay && (
                        <div>
                            <OptionsList optionList={poll.optionList}/>
                            <div className="mb-2">
                                <Button variant="primary" size='sm' onClick={handleAddOption}>
                                    Add New Option
                                </Button>{' '}
                                <Button variant="primary" size='sm'>
                                    Vote
                                </Button>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>
            <AddOptionForm showModal={showModal} setShowModal={setShowModal}/>
        </>
    );
}

export default Poll;