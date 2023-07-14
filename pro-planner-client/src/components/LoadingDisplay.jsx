import { Spinner } from "react-bootstrap";

import './LoadingDisplay.scss';

const LoadingDisplay = () => {
    return (
        <div className='loading-display'>
            <Spinner />
            <p>Loading...</p>
        </div>
    );
};

export default LoadingDisplay;

