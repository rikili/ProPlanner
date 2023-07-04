import React from 'react';
import Option from "./Option";
import {Form} from "react-bootstrap";


function Options({poll, setSelectedOption, selectedOption}) {

    const options = Object.values(poll.options)

    return (
        <>
            <Form>
                {options.map((option) =>
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

