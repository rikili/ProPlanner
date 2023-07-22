export const assembleClass = (...classes) => classes.filter(Boolean).join(' ');
export const buildServerRoute = (...routes) => {
    return `${process.env.REACT_APP_SERVER_URL}/${routes.join('/')}`;
}