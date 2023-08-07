// references:
// class assembling adapted from: https://stackoverflow.com/questions/30533171/react-js-conditionally-applying-class-attributes
// get IANA timezone: https://stackoverflow.com/questions/9772955/how-can-i-get-the-timezone-name-in-javascript

export const assembleClass = (...classes) => classes.filter(Boolean).join(' ');
export const buildServerRoute = (...routes) => {
    return `${process.env.REACT_APP_SERVER_URL}/${routes.join('/')}`;
};
export const getTimezone = () => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
        return 'America/Los_Angeles';
    }
};
