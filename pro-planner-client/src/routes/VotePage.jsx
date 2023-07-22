import React from "react";
import AddPollForm from "../components/AddPollForm";
import Polls from "../components/Polls";
import {useLocation} from "react-router-dom";

const VotePage = () => {

    // const tripId = useLocation().pathname.split('/')[1];
    const tripId = '64b832038c2ec130a6ce3ec4'; // testing purpose

    return <>
        <AddPollForm/>
        <Polls tripId={tripId}/>
    </>
};

export default VotePage;
