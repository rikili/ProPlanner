import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from "react-redux";
import ErrorToast from './ErrorToast';
import { ToastContainer } from 'react-bootstrap';
import './ErrorContainer.scss';
import { assembleClass } from '../helpers/Utils';

const handleOverlayClick = (event) => {
    event.stopPropagation();
}

const ErrorContainer = () => {
    const showErr = useSelector(state => state.error.isShowError);
    const disableControl = useSelector(state => state.error.disableControl);
    const closeButton = useRef(null);
    
    const handleKeyPress = useCallback((event) => {
        if (disableControl && event.keyCode === 9) {
            event.preventDefault();
            if (closeButton.current) {
                closeButton.current.focus();
            }
        }
    }, [disableControl, closeButton]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const adjustError = window.outerWidth <= 992;
    console.log(adjustError);

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
                />
            </>
            : null
        }
        {showErr && <ToastContainer position={adjustError ? "bottom-center" : "bottom-end"} className="err-toast-container"><ErrorToast ref={closeButton}/></ToastContainer>}
    </>
}

export default ErrorContainer;
