import ErrorContainer from '../components/ErrorContainer';
import { Outlet } from 'react-router';

const WrapperPage = () => {
    return (
        <>
            <ErrorContainer />
            <Outlet />
        </>
    );
};

export default WrapperPage;
