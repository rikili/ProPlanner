import React from 'react';
import Option from "./Option";
import {Form} from "react-bootstrap";


function Options({poll, setSelectedOption, selectedOption}) {

    return (
        <>
            <Form>
                {poll.options.map((option) =>
                    <Option option={option}
                            key={option.optionId}
                            poll={poll}
                            setSelectedOption={setSelectedOption}
                            selectedOption={selectedOption}
                    />)}
            </Form>
        </>
    );
}

export default Options;

