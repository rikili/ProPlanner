import { Toast } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { IoWarning } from 'react-icons/io5';
import { MdDangerous } from 'react-icons/md';
import { BsInfoCircleFill } from 'react-icons/bs';

import { resetError } from '../redux/errorSlice';
import { ERR_TYPE } from '../constants';
import '../styles/ErrorToast.scss';

const ErrorToast = () => {
    const showError = useSelector(state => state.error.isShowError);
    const errType = useSelector(state => state.error.errorType);
    const errMsg = useSelector(state => state.error.errorMessage);

    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(resetError());
    }

    let errIcon;
    switch (errType) {
        case ERR_TYPE.ERR:
            errIcon = <MdDangerous className="error-icon" color="red" />
            break;
        case ERR_TYPE.WARN:
            errIcon = <IoWarning className="error-icon" color="orange" />
            break;
        case ERR_TYPE.INFO:
            errIcon = <BsInfoCircleFill className="error-icon" color="navy" />
            break;
        default:

    }

    return <>
        {showError && <Toast className="m-3 position-relative err-toast" onClose={handleClose}>
            <Toast.Header className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                    {errIcon}
                    <strong className="ms-2">{errType}</strong>
                </div>
            </Toast.Header>
            <Toast.Body>
                {errMsg}
            </Toast.Body>
        </Toast>}
    </>
};

export default ErrorToast;
