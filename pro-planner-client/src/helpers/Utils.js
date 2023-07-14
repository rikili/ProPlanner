// references:
// class assembling adapted from: https://stackoverflow.com/questions/30533171/react-js-conditionally-applying-class-attributes
// get IANA timezone: https://stackoverflow.com/questions/9772955/how-can-i-get-the-timezone-name-in-javascript

export const assembleClass = (...classes) => classes.filter(Boolean).join(' ');
export const buildServerRoute = (...routes) => {
    return `${process.env.REACT_APP_SERVER_URL}/${routes.join('/')}`;
}
export const getTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;