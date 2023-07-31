import React from 'react';
import Option from "./Option";
import {Form} from "react-bootstrap";


function Options({poll, pollId, currUser, setSelectedOption, selectedOption}) {

    if (poll.options === null || !poll.options) {
        return <p>Please add an option to vote.</p>;
    }

    return (
        <>
            <Form>
                {Object.entries(poll.options).map(([key, option]) =>
                    <Option option={option}
                            optionId={key}
                            key={key}
                            poll={poll}
                            pollId={pollId}
                            currUser={currUser}
                            setSelectedOption={setSelectedOption}
                            selectedOption={selectedOption}
                    />)}
            </Form>
        </>
    );
}

export default Options;

