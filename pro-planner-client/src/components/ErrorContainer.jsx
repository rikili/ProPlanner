import { useEffect } from 'react';
import { useSelector } from "react-redux";
import ErrorToast from './ErrorToast';

const handleOverlayClick = (event) => {
    event.stopPropagation();
}

const ErrorContainer = ({ children }) => {
    const showErr = useSelector(state => state.error.isShowError);
    const disableControl = useSelector(state => state.error.disableControl);
    
    const handleKeyPress = (event) => {
        if (disableControl && event.keyCode === 9) {
            event.preventDefault();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    return <>
        {disableControl
            ? <>
                <div
                    className="min-vh-100 w-100 position-absolute"
                    style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1, top: 0, left: 0}}
                />
                <div
                    onClick={handleOverlayClick}
                    style={{ pointerEvents: 'none' }}
                >
                    {children}
                </div>
            </>
            : children
        }
        {showErr && <div className="position-absolute bottom-0 end-0"><ErrorToast /></div>}
    </>
};

export default ErrorContainer;
