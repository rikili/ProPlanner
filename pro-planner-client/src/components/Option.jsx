import React from 'react';
import {Form} from "react-bootstrap";

function Option({option}) {
    return (
        <>
            <Form.Check
                type={'radio'}
                id={'default-radio'}
                label={option.option}
            />
        </>
    );
}

export default Option;