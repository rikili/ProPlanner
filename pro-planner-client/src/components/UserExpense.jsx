import React, {useState} from 'react';
import {FaMinus, FaPlus} from "react-icons/fa6";
import {CiSquarePlus} from "react-icons/ci";
import {Form, Button, Card, Col, InputGroup, ListGroup, Row} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {addExpense} from "../redux/costSlice";
import {v4 as uuidv4} from "uuid";

const UserExpense = ({user, userId}) => {

    const expenses = Object.values(user.expenses);
    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    const [isAddingExpenseDisplay, setIsAddingExpenseDisplay] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [newItemAmount, setNewItemAmount] = useState(0);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const {name, value} = e.target;
        switch (name) {
            case "item":
                setNewItem(value);
                break;
            case "amount":
                setNewItemAmount(parseInt(value));
                break;
            default:
                break;
        }
    };

    let formResult = {
        expenseId: uuidv4(),
        userId: userId,
        newItem: newItem,
        newItemAmount: newItemAmount,
    }

    const handleAddClick = () => {
        dispatch(addExpense(formResult));
        setNewItem('');
        setNewItemAmount(0);
        setIsAddingExpenseDisplay(false);
    }

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
                        <Col style={{textAlign: 'right'}}>{`$${totalExpense}`}</Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    {Object.entries(expenses).map(([key, expense]) =>
                        <Row className="d-flex align-items-center mt-1"
                             key={key}>
                            <Col className="pe-0" xs={10}>
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
                                                  style={{marginRight: '10px'}}
                                                  name="item"
                                                  onChange={handleChange}/>
                                </InputGroup>
                            </Col>
                            <Col className="ps-0 pe-0" sm={3}>
                                <InputGroup>
                                    <Form.Control placeholder="Amount"
                                                  type="number"
                                                  name="amount"
                                                  onChange={handleChange}/>
                                </InputGroup>
                            </Col>
                            <Col style={{textAlign: 'right'}}>
                                <Button onClick={handleAddClick}>
                                    <FaPlus style={{margin: 'auto'}}/>
                                </Button>
                            </Col>
                        </Row>
                    )}
                    <Row>
                        <Col className="d-grid align-items-center mt-2">
                            <Button className="d-flex align-items-center"
                                    variant="outline-secondary"
                                    type='submit'
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
