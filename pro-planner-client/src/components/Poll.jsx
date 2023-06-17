import React from 'react';
import OptionsList from "./OptionsList";
import {Button, Card} from "react-bootstrap";
import {useState} from 'react';
import AddOptionForm from "./AddOptionForm";

function Poll({poll}) {

    const [showModal, setShowModal] = useState(false);

    const handleAddOption = () => {
        setShowModal(true);
    };

    return (
        <>
            <Card className='mt-4 p-4' style={{width: '700px'}}>
                <Card.Body>
                    <Card.Title>{poll.question}</Card.Title>
                    <OptionsList optionList={poll.optionList}/>
                    <div className="mb-2">
                        <Button variant="primary" size='sm' onClick={handleAddOption}>
                            Add New Option
                        </Button>{' '}
                        <Button variant="primary" size='sm'>
                            Vote
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <AddOptionForm showModal={showModal} setShowModal={setShowModal}/>

        </>
    );
}

export default Poll;