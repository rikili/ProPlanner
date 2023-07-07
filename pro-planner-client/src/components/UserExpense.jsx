import React, {useState} from 'react';
import {FaMinus, FaPlus} from "react-icons/fa6";
import {CiSquarePlus} from "react-icons/ci";
import {Form, Button, Card, Col, InputGroup, ListGroup, Row} from "react-bootstrap";

const UserExpense = ({user}) => {

    const expenses = Object.values(user.expenses);
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    const [isAddingExpenseDisplay, setIsAddingExpenseDisplay] = useState(false);
    const handleOpenInputClick = () => {
        if (!isAddingExpenseDisplay) {
            setIsAddingExpenseDisplay(true);
        } else {
            setIsAddingExpenseDisplay(false);
        }
    }

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
                        <Row className="d-flex align-items-center mt-1">
                            <Col className="pe-0" sm={10}>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>{expense.item}</Col>
                                            <Col style={{textAlign: 'right'}}>{`$${expense.amount}`}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col style={{textAlign: 'right'}}>
                                <Button>
                                    <FaMinus style={{margin: 'auto'}}/>
                                </Button>
                            </Col>
                        </Row>
                    )}
                    {isAddingExpenseDisplay && (
                        <Row className="d-flex align-items-center mt-4 mb-3">
                            <Col className="pe-0" sm={7}>
                                <InputGroup>
                                    <Form.Control placeholder="Item"
                                                  type="text"
                                                  style={{marginRight: '10px'}}/>
                                </InputGroup>
                            </Col>
                            <Col className="ps-0 pe-0" sm={3}>
                                <InputGroup>
                                    <Form.Control placeholder="Amount"
                                                  type="number"/>
                                </InputGroup>
                            </Col>
                            <Col style={{textAlign: 'right'}}>
                                <Button>
                                    <FaPlus style={{margin: 'auto'}}/>
                                </Button>
                            </Col>
                        </Row>
                    )}
                    <Row>
                        <Col className="d-grid align-items-center mt-2">
                            <Button className="d-flex align-items-center"
                                    variant="outline-secondary"
                                    onClick={handleOpenInputClick}>
                                <CiSquarePlus style={{margin: 'auto'}} size={25}/>
                            </Button>
                        </Col>
                    </Row>

                </Card.Body>
            </Card>
        </>
    );
}

export default UserExpense;