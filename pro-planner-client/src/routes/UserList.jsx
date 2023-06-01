import React from 'react';
import User from "./User";
import PropTypes from "prop-types";

function UserList({userList}) {
    if (!userList || userList.length === 0) {
        return <p>No User Yet</p>
    }

    return (
        <div>
            <p>Which one is you?</p>
            {userList.map((user) => (
                <User user={user}/>
            ))}
            <button onClick={() => console.log("navigate to creation page")}>
                Continue
            </button>
        </div>
    );
}

// type check and type warning prevention in console
UserList.propTypes = {
    userList: PropTypes.arrayOf(
        PropTypes.shape({
            userName: PropTypes.string.isRequired
        })
    )
}

export default UserList;