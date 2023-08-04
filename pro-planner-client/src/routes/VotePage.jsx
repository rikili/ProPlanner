import React, {useEffect} from "react";
import AddPollForm from "../components/AddPollForm";
import Polls from "../components/Polls";
import {getPollAsync} from "../redux/pollSlice";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router";

const VotePage = () => {
    const tripId = useLocation().pathname.split('/')[1];
    const polls = useSelector((state) => state.poll.polls);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPollAsync({tripId}))
    }, [dispatch])


    return <div>
        <AddPollForm polls={polls}/>
        <Polls polls={polls}/>
    </div>
};

export default VotePage;
