import TripExpense from "../components/TripExpense";
import ExpenseSplit from "../components/ExpenseSplit";
import { Row, Col, Container } from "react-bootstrap"

const CostPage = () => {
    return (
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
    );
}

export default CostPage;
