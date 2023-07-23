import React, {useEffect} from "react";
import AddPollForm from "../components/AddPollForm";
import Polls from "../components/Polls";
import {getPollAsync} from "../redux/pollSlice";
import {useDispatch, useSelector} from "react-redux";
import {LOAD_STATUS} from "../constants";

const VotePage = () => {

    // const tripId = useLocation().pathname.split('/')[1]; TODO...
    const tripId = '64b832038c2ec130a6ce3ec4'; // testing purpose

    const loadingState = useSelector((state) => state.poll.pollStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPollAsync({tripId}))
    }, [dispatch])


    return <>
        {/*TODO: uncomment once the LoadingDisplay is merged.*/}
        {/*{(loadingState === LOAD_STATUS.LOADING) && <LoadingDisplay/>}*/}
        <AddPollForm/>
        <Polls/>
    </>
};

export default VotePage;
