import { forwardRef, useEffect, useState } from 'react';
import { Toast } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { IoWarning } from 'react-icons/io5';
import { MdDangerous } from 'react-icons/md';
import { BsInfoCircleFill } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';

import {resetError} from '../redux/errorSlice';
import {ERR_TYPE} from '../constants';
import {useNavigate} from 'react-router-dom';
import './ErrorToast.scss';

const TOAST_AUTOCLOSE_TIMER = 8000;

let closeToastTimeout;
const ErrorToast = forwardRef((_, ref) => {
    const showError = useSelector(state => state.error.isShowError);
    const errType = useSelector(state => state.error.errorType);
    const errMsg = useSelector(state => state.error.errorMessage);
    const errRedir = useSelector(state => state.error.redirect);
    const errDisable = useSelector(state => state.error.disableControl);
    const errTime = useSelector(state => state.error.timestamp);
    const [show, setShow] = useState(false);

    const doSetTimeout = errRedir || !errDisable

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const closeToast = () => {
        if (closeToastTimeout) {
            clearTimeout(closeToastTimeout);
        }
        setShow(false);
        if (errRedir) navigate(errRedir);
        dispatch(resetError());
        closeToastTimeout = null;
    }
    const setAutohideTimer = () => setTimeout(() => closeToast(), TOAST_AUTOCLOSE_TIMER);

    const resetTimeout = () => {
        if (closeToastTimeout) clearTimeout(closeToastTimeout);
        closeToastTimeout = setAutohideTimer();
    }

    useEffect(() => {
        if (showError && !show) {
            setShow(true);
            if (doSetTimeout) closeToastTimeout = setAutohideTimer();
        }

        if (!showError && show) {
            setShow(false);
            closeToast();
        }

        if (errTime) {
            if (doSetTimeout) resetTimeout();
        }
    }, [showError, errTime]);

    const handleCloseToast = () => {
        closeToast();
    }

    let errIcon;
    switch (errType) {
        case ERR_TYPE.ERR:
            errIcon = <MdDangerous className="error-icon" color="red"/>
            break;
        case ERR_TYPE.WARN:
            errIcon = <IoWarning className="error-icon" color="orange"/>
            break;
        case ERR_TYPE.INFO:
            errIcon = <BsInfoCircleFill className="error-icon" color="navy"/>
            break;
        default:
    }

    return <>
        <Toast
            className="m-3 err-toast"
            show={show}
            animation={false}
        >
            <Toast.Header className="d-flex justify-content-between" closeButton={false}>
                <div className="d-flex align-items-center">
                    {errIcon}
                    <strong className="ms-2">{errType}</strong>
                </div>
                <button className="toast-close" onClick={handleCloseToast} ref={ref}>
                    <CgClose className="close-symbol"/>
                </button>
            </Toast.Header>
            <Toast.Body>
                {errMsg}
            </Toast.Body>
        </Toast>
    </>
});

export default ErrorToast;
