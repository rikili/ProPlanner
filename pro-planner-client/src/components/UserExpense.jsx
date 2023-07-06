import React from 'react';
import {Button, Card, Col, ListGroup, Row} from "react-bootstrap";

const UserExpense = ({user}) => {

    const expenses = Object.values(user.expenses);
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    return (
        <>
            <Card className='mt-2'
                  style={{width: '500px'}}>
                <Card.Header as="h5">
                    <Row>
                        <Col>{user.userName}</Col>
                        <Col style={{textAlign: 'right'}}>{`$${totalAmount}`}</Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    {expenses.map((expense) =>
                        <Row>
                            <Col sm={9}>
                                <ListGroup className='mt-1'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>{expense.item}</Col>
                                            <Col style={{textAlign: 'right'}}>{`$${expense.amount}`}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col className="d-flex align-items-center">
                                <Button variant="danger" style={{marginLeft: 'auto'}}>Remove</Button>
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>
        </>
    );
}

export default UserExpense;