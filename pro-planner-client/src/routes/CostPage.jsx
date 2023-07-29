import TripExpense from "../components/TripExpense";
import ExpenseSplit from "../components/ExpenseSplit";
import LoadingDisplay from "../components/LoadingDisplay"
import { getCostAsync } from "../redux/costSlice";
import { Row, Col, Container } from "react-bootstrap"
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import React, {useEffect} from "react";
import {LOAD_STATUS} from "../constants";

const CostPage = () => {

    const tripId = useLocation().pathname.split('/')[1];
    const loadingState = useSelector((state) => state.cost.costStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCostAsync({tripId}))
    }, [dispatch, tripId])

    return (
        <>
            {(loadingState === LOAD_STATUS.LOADING) && <LoadingDisplay/>}
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
        </>
    );
}

export default CostPage;
