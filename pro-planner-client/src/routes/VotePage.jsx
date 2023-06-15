import React from "react";
import NavigationBar from "../components/NavigationBar";
import AddPollForm from "../components/AddPollForm";
import PollsList from "../components/PollsList";

const VotePage = () => {
    return <>
        <NavigationBar/>
        <AddPollForm/>
        <PollsList/>
    </>
};

export default VotePage;
