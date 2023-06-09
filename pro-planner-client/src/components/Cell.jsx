import React from 'react';
import { getDate } from 'date-fns/fp'

const Cell = (props) => {
    return (
        <div className="half-day"> {getDate(props.date)} </div>
    );
}

export default Cell;