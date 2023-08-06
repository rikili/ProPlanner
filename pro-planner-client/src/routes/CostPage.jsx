import TripExpense from "../components/TripExpense";
import ExpenseSplit from "../components/ExpenseSplit";
import LoadingDisplay from "../components/LoadingDisplay"
import { Col, Container } from "react-bootstrap"
import { useSelector } from "react-redux";
import React from "react";
import {LOAD_STATUS} from "../constants";
import './CostPage.scss';

const CostPage = () => {
    const loadingState = useSelector((state) => state.cost.costStatus);

    return (
        <>
            {(loadingState === LOAD_STATUS.LOADING) 
            ? <LoadingDisplay/>
            : <Container className="cost-page">
                <Col>
                    <TripExpense className="expense-list" />
                </Col>
                <Col>
                    <ExpenseSplit className="cost-split"/>
                </Col>
            </Container>}
        </>
    );
}

export default CostPage;
