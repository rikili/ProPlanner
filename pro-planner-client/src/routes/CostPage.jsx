import NavigationBar from "../components/NavigationBar";
import TripExpense from "../components/TripExpense";
import ExpenseSplit from "../components/ExpenseSplit";
import { Row, Col, Container } from "react-bootstrap"

const CostPage = () => {
    return <>
        <NavigationBar />
        <Container>
            <Row>
                <Col>
                    <TripExpense />
                </Col>
                <Col>
                    <ExpenseSplit />
                </Col>
            </Row>

        </Container>
        
        {/* <div className="d-flex justify-content-center">
            <ExpenseSplit />
        </div> */}
    </>
}

export default CostPage;
