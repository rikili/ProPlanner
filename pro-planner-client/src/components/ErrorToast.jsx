import {forwardRef} from 'react';
import {Toast} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import {IoWarning} from 'react-icons/io5';
import {MdDangerous} from 'react-icons/md';
import {BsInfoCircleFill} from 'react-icons/bs';
import {CgClose} from 'react-icons/cg';

import {resetError} from '../redux/errorSlice';
import {ERR_TYPE} from '../constants';
import {useNavigate} from 'react-router-dom';
import './ErrorToast.scss';

const ErrorToast = forwardRef((props, ref) => {
    const showError = useSelector(state => state.error.isShowError);
    const errType = useSelector(state => state.error.errorType);
    const errMsg = useSelector(state => state.error.errorMessage);
    const errRedir = useSelector(state => state.error.redirect);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleCloseToast = () => {
        if (errRedir) navigate(errRedir);
        dispatch(resetError());
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
        {showError
            && <Toast
                className="m-3 position-relative err-toast"
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
            </Toast>}
    </>
});

export default ErrorToast;
