import { Spinner } from 'react-bootstrap';

import './LoadingDisplay.scss';

const LoadingDisplay = ({ label = true, className }) => {
    return (
        <div className={`${className} loading-display`}>
            <Spinner />
            {label && <p>Loading...</p>}
        </div>
    );
};

export default LoadingDisplay;
