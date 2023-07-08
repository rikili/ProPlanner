

import {Container} from "react-bootstrap";
import {Button, Card, Col, ListGroup, Row, ProgressBar} from "react-bootstrap";
import { useSelector } from "react-redux";

const ExpenseSplit = () => { 
    const budget = useSelector(state => state.planParameters.budget);
    const cost  = useSelector(state => state.cost);

    const getSpentAmount = () => {
        let spendings = 0;
        // console.log(cost.users)
        Object.values(cost).forEach(user => {
            Object.values(user.expenses).forEach(expense => {
                spendings += Object.values(expense)[1];
            });
        });
        // Object.entries(cost.users).forEach( (key, val) => {
        //     console.log(val[])
        // });
        return spendings;
    }
    
    const spentAmount = getSpentAmount();
    const spentToAvailableRatio = Math.round(spentAmount / budget * 100);


    return (
        <>
            <Card className='mt-2'
                  style={{width: '500px'}}>
                <Card.Header as="h5" className="text-center" >
                Cost Split Calculations
                </Card.Header>
                <Card.Body>
                    <Row> 
                        <Col>Budget</Col>
                        <Col className="text-end"> { budget } </Col>
                    </Row>
                    <Row> 
                        <Col>Spent</Col>
                        <Col className="text-end"> { spentAmount } </Col>
                    </Row>
                    <Row> 
                        <Col>Available</Col>
                        <Col className="text-end"> { budget - spentAmount } </Col>
                    </Row>
                    <ProgressBar 
                        striped variant="success" 
                        now={spentToAvailableRatio} label={`${spentToAvailableRatio}%`} />
                </Card.Body>
            </Card>
        </>
    );

};

export default ExpenseSplit;