import React from 'react';
import PropTypes from 'prop-types';

function User({ user }) {
    return (
        <div>
            {user.userName}
        </div>
    );
}

// type check and type warning prevention in console
User.propTypes = {
    user: PropTypes.object.isRequired
}

export default User;