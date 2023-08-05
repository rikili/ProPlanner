import React from 'react';
import Poll from "./Poll";

function Polls({polls}) {

    if (polls === null || !polls) {
        return;
    }


    return (
        <>
            {Object.entries(polls).map(([key, poll]) =>
                <Poll poll={poll}
                      pollId={key}
                      key={key}
                />)}
        </>
    );
}

export default Polls;

