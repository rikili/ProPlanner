import { Container } from 'react-bootstrap';
import { MdModeEditOutline } from 'react-icons/md';
import { RiCheckFill, RiCloseFill } from 'react-icons/ri';
import { BiTargetLock } from 'react-icons/bi';
import './CalendarControls.scss';

const CalendarControls = ({
    toggleEdit,
    confirmEdit,
    editing,
    deciding,
    toggleDecision,
    confirmDecisions,
}) => {
    const handleSubmit = () => {
        if (editing) confirmEdit();
        if (deciding) confirmDecisions();
    };

    const handleCancel = () => {
        if (editing) toggleEdit();
        if (deciding) toggleDecision();
    };

    return (
        <Container className="trip-controls">
            <div className="control-container">
                {editing && <p className="control-label">Editing...</p>}
                {deciding && <p className="control-label">Making a decision...</p>}
                {(editing || deciding) && (
                    <div className="control-layer">
                        <button onClick={handleSubmit} className="control-button confirm">
                            <RiCheckFill />
                        </button>
                        <button onClick={handleCancel} className="control-button close">
                            <RiCloseFill />
                        </button>
                    </div>
                )}
                {!editing && (
                    <>
                        {!deciding && (
                            <>
                                <div className="control-layer">
                                    <p className="control-label">Edit your selections</p>
                                    <button onClick={toggleEdit} className="control-button">
                                        <MdModeEditOutline />
                                    </button>
                                </div>
                                <div className="control-layer">
                                    <p className="control-label">
                                        Ready to decide? Select a decision for the plan
                                    </p>
                                    <button
                                        onClick={toggleDecision}
                                        className="control-button decision">
                                        <BiTargetLock />
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </Container>
    );
};

export default CalendarControls;
