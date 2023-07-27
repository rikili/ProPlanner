import React, {useEffect} from "react";
import AddPollForm from "../components/AddPollForm";
import Polls from "../components/Polls";
import {getPollAsync} from "../redux/pollSlice";
import {useDispatch, useSelector} from "react-redux";
import {LOAD_STATUS} from "../constants";
import LoadingDisplay from "../components/LoadingDisplay";
import {useLocation} from "react-router";

const VotePage = () => {

    const tripId = useLocation().pathname.split('/')[1];
    const loadingState = useSelector((state) => state.poll.pollStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPollAsync({tripId}))
    }, [dispatch])


    return <>
        {(loadingState === LOAD_STATUS.LOADING) && <LoadingDisplay/>}
        <AddPollForm/>
        <Polls/>
    </>
};

export default VotePage;
