import { useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

let timeoutTrack;
const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    useEffect(() => {
        if (timeoutTrack) {
            clearTimeout(timeoutTrack);
            timeoutTrack = null;
        }
        timeoutTrack = setTimeout(() => {
            timeoutTrack = null;
            navigate('/');
        }, 5000);
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
            <h1 className="mb-3" style={{ color: 'rgb(23, 69, 126)' }}>
                ProPlanner
            </h1>
            <p className="text-center" style={{ fontSize: '1.3em' }}>
                <b>{`${error.status} ${error.statusText}.`}</b>
                <br />
                Seems like you've ended up somewhere you shouldn't be
                <br />
            </p>
            <p style={{ color: 'grey' }}>You will be redirected shortly. . .</p>
        </div>
    );
};

export default ErrorPage;
