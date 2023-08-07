import { FiLink } from 'react-icons/fi';

const Clipboard = (props) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}>
            <FiLink />
        </svg>
    );
};

export default Clipboard;
