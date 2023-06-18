import React from "react";
import NavigationBar from "../components/NavigationBar";
import AddPollForm from "../components/AddPollForm";
import Polls from "../components/Polls";

const VotePage = () => {
    return <>
        <NavigationBar/>
        <AddPollForm/>
        <Polls/>
    </>
};

export default VotePage;
