import React, {useEffect} from "react";
import AddPollForm from "../components/AddPollForm";
import Polls from "../components/Polls";
import {getPollAsync} from "../redux/pollSlice";
import {useDispatch, useSelector} from "react-redux";
import {LOAD_STATUS} from "../constants";
import LoadingDisplay from "../components/LoadingDisplay";
import {useLocation} from "react-router";

const VotePage = () => {

    // const planId = '64c5cbf8b6cdc4ef3c78be6a'; // testing purpose
    const planId = useLocation().pathname.split('/')[1];
    const polls = useSelector((state) => state.poll.polls);
    const loadingState = useSelector((state) => state.poll.pollStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPollAsync({planId}))
    }, [dispatch])


    return <>
        {(loadingState === LOAD_STATUS.LOADING) && <LoadingDisplay/>}
        <AddPollForm polls={polls}/>
        <Polls polls={polls}/>
    </>
};

export default VotePage;
