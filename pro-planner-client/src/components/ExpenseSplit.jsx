

import { useEffect } from "react";
import {Container} from "react-bootstrap";
import {Button, Card, Col, ListGroup, Row, ProgressBar} from "react-bootstrap";
import { useSelector } from "react-redux";

const ExpenseSplit = () => { 
    const budget = useSelector(state => state.planParameters.budget);
    const cost  = useSelector(state => state.cost);
    const userSpendings = []; // [[user1Name, user1Spending], [user2Name, user2Spending], ... ]
    let totalSpendings = 0;
    let costPerUser;
    let spentToAvailableRatio;

    const processExpenses = () => {
        Object.values(cost).forEach((user, index) => {
            const userName = user.userName;
            const userInputs = Object.values(user.expenses);
            const userExpenses = userInputs.reduce((total, expense) => total + expense.amount, 0);
            userSpendings.push([userName, userExpenses])
            totalSpendings += userExpenses;
        });

        costPerUser =  totalSpendings / Object.keys(cost).length;
        spentToAvailableRatio = parseFloat((totalSpendings / budget * 100).toFixed(2));
    }

    const processCostSplit = () => {
        userSpendings.sort((a, b) => a[1] - b[1]);
        let startIndex = 0;
        let endIdex = userSpendings.length - 1;
        while (startIndex < endIdex) {
            if (userSpendings[startIndex][1] >= costPerUser) break;
            // transfer money
            (userSpendings[startIndex][1] >= costPerUser) ? startIndex++ : endIdex--;
        }
        console.log(userSpendings)
    }

    const calcVariant = () => {
        if (spentToAvailableRatio < 50) return "success";
        if (spentToAvailableRatio < 75) return "info";
        if (spentToAvailableRatio < 100) return "warning";
        return "danger";
    }

    processExpenses();
    processCostSplit();

    return (
        <>
            <Card className='mt-2'
                  style={{width: '500px'}}>
                <Card.Header as="h5" className="text-center" >
                Cost Split Calculations
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item>User 1 - $200 - User 2</ListGroup.Item>
                        <ListGroup.Item>User 1 - $100 - User 3</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
                <Card.Footer>
                <Row> 
                        <Col>Budget</Col>
                        <Col className="text-end"> ${ budget } </Col>
                    </Row>
                    <Row> 
                        <Col>Spent</Col>
                        <Col className="text-end"> ${ totalSpendings } </Col>
                    </Row>
                    <Row> 
                        <Col>Available</Col>
                        <Col className="text-end"> ${ budget - totalSpendings } </Col>
                    </Row>
                    <ProgressBar 
                        striped variant={ calcVariant() }
                        now={spentToAvailableRatio} label={`${spentToAvailableRatio}%`} />
                </Card.Footer>
            </Card>
        </>
    );

};

export default ExpenseSplit;