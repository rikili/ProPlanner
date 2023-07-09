import {Card, Col, ListGroup, Row, ProgressBar} from "react-bootstrap";
import { useSelector } from "react-redux";
import { FcAdvance } from "react-icons/fc";




const ExpenseSplit = () => { 
    const budget = useSelector(state => state.planParameters.budget);
    const cost  = useSelector(state => state.cost);
    const userSpendings = [];
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

        costPerUser =  parseFloat((totalSpendings / Object.keys(cost).length).toFixed(2));
        spentToAvailableRatio = Math.round(totalSpendings / budget * 100);
    }

    const processCostSplit = () => {
        userSpendings.sort((a, b) => a[1] - b[1]);
        let leftIndex = 0;
        let rightIndex = userSpendings.length - 1;
        const results = [];

        while (leftIndex < rightIndex) {
            let leftUserOwes = costPerUser - userSpendings[leftIndex][1];
            let rightUserAmount = userSpendings[rightIndex][1];
            let key = 0;

            if (!leftUserOwes) {
                leftIndex++;
            } else if ( (rightUserAmount - leftUserOwes) > costPerUser) {
                userSpendings[leftIndex][1] += leftUserOwes;
                userSpendings[rightIndex][1] -= leftUserOwes;
                results.push(
                    <ListGroup.Item as="h5" key={key} style={{textAlign: "center"}}>
                        <Row>
                            <Col>{userSpendings[leftIndex][0]} :</Col>
                            <Col>${leftUserOwes}</Col>
                            <Col><FcAdvance style={{ transform: 'scale(2.2)', margin: "0px 1em 0.1em 1em"}}/></Col>
                            <Col>{userSpendings[rightIndex][0]}</Col>
                        </Row>
                    </ListGroup.Item>
                );    
                leftIndex++;
            } else {
                const leftUserPaysRightUser = parseFloat((rightUserAmount - costPerUser).toFixed(2));
                userSpendings[leftIndex][1] += leftUserPaysRightUser;
                userSpendings[rightIndex][1] -= leftUserPaysRightUser;
                results.push(
                    <ListGroup.Item as="h5" key={key} style={{textAlign: "center"}}>
                        <Row>
                            <Col> {userSpendings[leftIndex][0]} :</Col>
                            <Col>${leftUserPaysRightUser}</Col>
                            <Col><FcAdvance style={{ transform: 'scale(2.2)', margin: "0px 1em 0.1em 1em"}}/></Col>
                            <Col>{userSpendings[rightIndex][0]}</Col>
                        </Row>
                    </ListGroup.Item>
                );    
                rightIndex--;
            }
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
        <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <Card className='mt-2' style={{width: '450px'}}>
                <Card.Header as="h4" className="text-center" >
                Cost Split Calculations
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {processCostSplit()}
                    </ListGroup>
                </Card.Body>
                <Card.Footer>
                    {
                        budget &&
                        <Row style={{marginLeft: "8px", marginRight: "8px"}}> 
                            <Col as="h5"> Budget </Col>
                            <Col as="h5" className="text-end"> ${ budget } </Col>
                        </Row>
                    }
                    <Row style={{marginLeft: "10px", marginRight: "8px"}}> 
                        <Col as="h5"> Spent </Col>
                        <Col as="h5" className="text-end"> ${ totalSpendings } </Col>
                    </Row>
                    {   
                        budget && <>
                            <Row style={{marginLeft: "8px", marginRight: "8px"}}> 
                                <Col as="h5"> Availble </Col>
                                <Col as="h5" className="text-end"> ${ budget - totalSpendings } </Col>
                            </Row>
                            <ProgressBar 
                                style={{transform: 'scaleY(1.8)', margin: '8px'}}
                                striped variant={ calcVariant() }
                                now={spentToAvailableRatio} label={`${spentToAvailableRatio}%`} /> </>
                    }
                </Card.Footer>
            </Card>
        </div>
    );

};

export default ExpenseSplit;