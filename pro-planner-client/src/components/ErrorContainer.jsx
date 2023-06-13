import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from "react-redux";
import { Outlet } from 'react-router-dom';
import ErrorToast from './ErrorToast';

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
    }, [disableControl]);

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
                    <Outlet />
                </div>
            </>
            : <Outlet />
        }
        {showErr && <div className="position-absolute bottom-0 end-0"><ErrorToast ref={closeButton}/></div>}
    </>
};

export default ErrorContainer;
