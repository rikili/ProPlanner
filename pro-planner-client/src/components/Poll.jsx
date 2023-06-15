import React from 'react';
import OptionsList from "./OptionsList";
import {Button, Card} from "react-bootstrap";

function Poll({poll}) {
    return (
        <>
            <Card className='mt-4 p-4' style={{width: '700px'}}>
                <Card.Body>
                    <Card.Title>{poll.question}</Card.Title>
                    <OptionsList optionList={poll.optionList}/>
                    <div className="mb-2">
                        <Button variant="primary" size='sm'>
                            Add Option
                        </Button>{' '}
                        <Button variant="primary" size='sm'>
                            Vote
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}

export default Poll;