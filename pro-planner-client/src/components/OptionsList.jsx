import React from 'react';
import Option from "./Option";
import {Form} from "react-bootstrap";


function OptionsList({optionList}) {

    return (
        <>
            <Form>
                {optionList.map((option) =>
                    <Option option={option}/>)}
            </Form>
        </>
    );
}

export default OptionsList;