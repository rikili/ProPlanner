import React from 'react';
import Option from "./Option";
import {Form} from "react-bootstrap";


function Options({poll, setSelectedOptions, selectedOptions}) {

    return (
        <>
            <Form>
                {poll.options.map((option) =>
                    <Option option={option}
                            key={option.optionId}
                            poll={poll}
                            setSelectedOptions={setSelectedOptions}
                            selectedOptions={selectedOptions}
                    />)}
            </Form>
        </>
    );
}

export default Options;