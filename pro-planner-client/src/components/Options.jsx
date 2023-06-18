import React from 'react';
import Option from "./Option";
import {Form} from "react-bootstrap";


function Options({options, pollId, setSelectedOptions, selectedOptions}) {

    return (
        <>
            <Form>
                {options.map((option, index) =>
                    <Option option={option}
                            index={index}
                            pollId={pollId}
                            key={index}
                            setSelectedOptions={setSelectedOptions}
                            selectedOptions={selectedOptions}/>)}
            </Form>
        </>
    );
}

export default Options;