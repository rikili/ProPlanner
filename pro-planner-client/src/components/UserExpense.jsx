import React from 'react';
import {Card, Col, ListGroup, Row} from "react-bootstrap";

const UserExpense = ({user}) => {

    const expenses = Object.values(user.expenses);

    return (
        <>
            <Card className='mt-2'
                  style={{width: '500px'}}>
                <Card.Header as="h5">
                    <Row>
                        <Col>{user.userName}</Col>
                        <Col style={{textAlign: 'right'}}>{`$100`}</Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <ListGroup>
                        {expenses.map((expense) =>
                            <ListGroup.Item>
                                {expense.item}
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card.Body>
            </Card>
        </>
    );
}

export default UserExpense;