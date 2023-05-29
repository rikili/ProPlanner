import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return <p>
        <b>404 Page Not Found.</b> There seems to be an error with the URL path.
    </p>
}

export default ErrorPage;