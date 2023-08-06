import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from "react-redux";
import ErrorToast from './ErrorToast';
import { ToastContainer } from 'react-bootstrap';
import './ErrorContainer.scss';
import { matchRoutes, useLocation } from 'react-router-dom';
import { assembleClass } from '../helpers/Utils';

const NON_OFFSET_PATHS = [{path: '/'}, {path: '/create'}, {path: '/user/:id'}];
const LG_BREAKPOINT_WIDTH = 992;

const handleOverlayClick = (event) => {
    event.stopPropagation();
}

const ErrorContainer = () => {
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

    const adjustError = window.outerWidth <= LG_BREAKPOINT_WIDTH;

    const location = useLocation();
    const nonOffset = !!matchRoutes(NON_OFFSET_PATHS, location);

    return <>
        {disableControl
            ? <>
                <div
                    className="min-vh-100 w-100 position-absolute"
                    style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1, top: 0, left: 0, zIndex: 4}}
                />
                <div
                    onClick={handleOverlayClick}
                    style={{ pointerEvents: 'none' }}
                />
            </>
            : null
        }
        <ToastContainer position={nonOffset ? "top-end" : (adjustError ? "bottom-center" : "bottom-end")}
                        className={assembleClass(!nonOffset && 'offset', "err-toast-container")}>
            <ErrorToast ref={closeButton}/>
        </ToastContainer>
    </>
}

export default ErrorContainer;
