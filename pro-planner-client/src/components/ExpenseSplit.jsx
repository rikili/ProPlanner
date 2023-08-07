import {Card, Col, ListGroup, Row, ProgressBar} from "react-bootstrap";
import { useSelector } from "react-redux";
import { FcAdvance } from "react-icons/fc";
import './ExpenseSplit.scss';

const ExpenseSplit = ({ className }) => { 
    const budget = useSelector(state => state.planParameters.budget);
    const costs  = useSelector(state => state.cost.costs);
    const userSpendings = [];
    let totalSpendings = 0;
    let costPerUser;
    let spentToAvailableRatio;


    const processExpenses = () => {
        if (costs) {
            Object.values(costs).forEach((user) => {
                const userName = user.userName;
                const userInputs = Object.values(user.expenses);
                const userExpenses = userInputs.reduce((total, expense) => total + expense.amount, 0);
                userSpendings.push([userName, userExpenses])
                totalSpendings += userExpenses;
            });
    
            costPerUser =  parseFloat((totalSpendings / Object.keys(costs).length).toFixed(2));
            spentToAvailableRatio = Math.round(totalSpendings / budget * 100);
        }
    }

    const processCostSplit = () => {
        userSpendings.sort((a, b) => a[1] - b[1]);
        let leftIndex = 0;
        let rightIndex = userSpendings.length - 1;
        const results = [];
        let key = 0;

        while (leftIndex < rightIndex) {
            let leftUserOwes = (costPerUser - userSpendings[leftIndex][1]).toFixed(2);
            let rightUserAmount = userSpendings[rightIndex][1];

            if (!leftUserOwes) {
                leftIndex++;
            } else if ( (rightUserAmount - leftUserOwes) > costPerUser) {
                userSpendings[leftIndex][1] += leftUserOwes;
                userSpendings[rightIndex][1] -= leftUserOwes;
                results.push(
                    <ListGroup.Item as="h5" key={`split-item-${key}`} style={{textAlign: "center"}}>
                        <div className="cost-row">
                            <Col> {userSpendings[leftIndex][0]} :</Col>
                            <Col>${leftUserOwes}</Col>
                            <Col lg={2}><FcAdvance className="cost-arrow"/></Col>
                            <Col>{userSpendings[rightIndex][0]}</Col>
                        </div>
                    </ListGroup.Item>
                );    
                leftIndex++;
            } else {
                const leftUserPaysRightUser = parseFloat((rightUserAmount - costPerUser).toFixed(2));
                userSpendings[leftIndex][1] += leftUserPaysRightUser;
                userSpendings[rightIndex][1] -= leftUserPaysRightUser;
                results.push(
                    <ListGroup.Item as="h5" key={`split-item-${key}`} style={{textAlign: "center"}}>
                        <div className="cost-row">
                            <Col > {userSpendings[leftIndex][0]} :</Col>
                            <Col>${leftUserPaysRightUser}</Col>
                            <Col lg={2}><FcAdvance className="cost-arrow"/></Col>
                            <Col>{userSpendings[rightIndex][0]}</Col>
                        </div>
                    </ListGroup.Item>
                );    
                rightIndex--;
            }
            key++;
        }
        
        return results;
    }

    const calcVariant = () => {
        if (spentToAvailableRatio < 50) return "success";
        if (spentToAvailableRatio < 75) return "info";
        if (spentToAvailableRatio < 100) return "warning";
        return "danger";
    }

    processExpenses();

    return (
        <>
            <Card className={className}>
                <Card.Header as="h4" >
                Cost Split Calculations
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {processCostSplit()}
                    </ListGroup>
                </Card.Body>
                <Card.Footer>
                    {
                        budget && (budget > 0) &&
                        <Row style={{marginLeft: "9px", marginRight: "9px"}}> 
                            <Col as="h5"> Budget </Col>
                            <Col as="h5" className="text-end"> ${ budget } </Col>
                        </Row>
                    }
                    <Row style={{marginLeft: "9px", marginRight: "9px"}}> 
                        <Col as="h5"> Spent </Col>
                        <Col as="h5" className="text-end"> ${ totalSpendings } </Col>
                    </Row>
                    {   
                        budget && (budget > 0) && <>
                            <Row style={{marginLeft: "9px", marginRight: "9px"}}> 
                                <Col as="h5"> Availble </Col>
                                <Col as="h5" className="text-end"> ${ budget - totalSpendings } </Col>
                            </Row>
                            <>{console.log("spentToAvailableRatio " + spentToAvailableRatio)}</>
                            <ProgressBar 
                                style={{margin: '9px'}}
                                striped variant={ calcVariant() }
                                now={spentToAvailableRatio || 0} label={`${spentToAvailableRatio || 0}%`} /> </>
                    }
                </Card.Footer>
            </Card>
        </>
    );

};

export default ExpenseSplit;