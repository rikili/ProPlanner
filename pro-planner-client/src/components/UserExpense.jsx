import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { CiSquarePlus } from 'react-icons/ci';
import { Form, Card, Col, InputGroup, ListGroup, Row, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addExpenseAsync, removeExpenseAsync } from '../redux/costSlice';
import { useLocation } from 'react-router';
import { setError } from '../redux/errorSlice';
import { ERR_TYPE } from '../constants';
import Button from './override/Button';

const MAX_ITEM_LIMIT = 40;

const UserExpense = ({ user, userId, currUserId }) => {
    const expenses = Object.values(user.expenses);
    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    const [isAddingExpenseDisplay, setIsAddingExpenseDisplay] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [newItemAmount, setNewItemAmount] = useState(0);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteExpenseId, setDeleteExpenseId] = useState(null);
    const dispatch = useDispatch();
    const handleClose = () => setShowDeleteConfirmation(false);
    const tripId = useLocation().pathname.split('/')[1];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'item':
                setNewItem(value);
                break;
            case 'amount':
                setNewItemAmount(parseInt(value));
                break;
            default:
                break;
        }
    };

    const handleAddExpense = () => {
        let formResult = {
            tripId: tripId,
            userId: userId,
            newItem: newItem,
            newItemAmount: newItemAmount,
        };

        const formattedNewItem = newItem.trim();

        if (!formResult.newItem) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Item is missing. Please enter an item.',
                })
            );
            return null;
        }

        if (formResult.newItemAmount === 0) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: 'Amount is missing. Please enter an amount.',
                })
            );
            return null;
        }

        if (formattedNewItem.length > MAX_ITEM_LIMIT) {
            dispatch(
                setError({
                    errType: ERR_TYPE.ERR,
                    message: `Item is invalid. Item must not exceed ${MAX_ITEM_LIMIT} characters.`,
                })
            );
            return null;
        }

        dispatch(addExpenseAsync(formResult));
        setNewItem('');
        setNewItemAmount(0);
        setIsAddingExpenseDisplay(false);
    };

    const handleConfirmationModal = (expenseID) => {
        setDeleteExpenseId(expenseID);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteExpense = () => {
        if (deleteExpenseId) {
            let target = {
                tripId: tripId,
                userId: userId,
                expenseId: deleteExpenseId,
            };
            dispatch(removeExpenseAsync(target));
        }
        setDeleteExpenseId(null);
        setShowDeleteConfirmation(false);
    };

    const handleOpenAddExpenseForm = () => {
        if (!isAddingExpenseDisplay) {
            setIsAddingExpenseDisplay(true);
        } else {
            setIsAddingExpenseDisplay(false);
        }
    };

    const isDisabled = userId !== currUserId;

    return (
        <>
            <Card>
                <Card.Header as="h5">
                    <Row>
                        <Col>{user.userName}</Col>
                        <Col style={{ textAlign: 'right' }}>{`$${totalExpense}`}</Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    {Object.entries(user.expenses).map(([key, expense]) => (
                        <Row className="d-flex align-items-center mt-1 flex-nowrap" key={key}>
                            <Col sm={!isDisabled ? 10 : null}  xs={!isDisabled ? 9 : null} className="pe-0">
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>{expense.item}</Col>
                                            <Col
                                                style={{
                                                    textAlign: 'right',
                                                }}>{`$${expense.amount}`}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            {!isDisabled && (
                                <Col style={{ textAlign: 'right' }}>
                                    <Button
                                        onClick={() => handleConfirmationModal(key)}
                                        variant="custom-danger">
                                        <FaMinus style={{ margin: 'auto' }} />
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    ))}
                    {isAddingExpenseDisplay && (
                        <Row className="d-flex align-items-center mt-2 mb-3">
                            <Col className="pe-0" sm={7} xs={6}>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Item"
                                        type="text"
                                        style={{ marginRight: '10px' }}
                                        name="item"
                                        onChange={handleInputChange}
                                    />
                                </InputGroup>
                            </Col>
                            <Col className="ps-0 pe-0" sm={3} xs={3}>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Amount"
                                        type="number"
                                        name="amount"
                                        onChange={handleInputChange}
                                    />
                                </InputGroup>
                            </Col>
                            <Col style={{ textAlign: 'right' }}>
                                <Button onClick={handleAddExpense} variant="custom-primary">
                                    <FaPlus style={{ margin: 'auto' }} />
                                </Button>
                            </Col>
                        </Row>
                    )}
                    {!isDisabled && (
                        <Row>
                            <Col className="d-grid align-items-center mt-2">
                                <Button
                                    className="d-flex align-items-center"
                                    variant="outline-secondary"
                                    type="submit"
                                    onClick={handleOpenAddExpenseForm}
                                    disabled={isDisabled}>
                                    <CiSquarePlus style={{ margin: 'auto' }} size={25} />
                                </Button>
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>
            <Modal show={showDeleteConfirmation} onHide={handleClose}>
                <Modal.Body>Do you want to delete the expense?</Modal.Body>
                <Modal.Footer>
                    <Button variant="custom-secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="custom-primary" onClick={handleDeleteExpense}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UserExpense;
