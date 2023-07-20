import { Container } from 'react-bootstrap';
import { MdModeEditOutline } from 'react-icons/md';
import { RiCheckFill, RiCloseFill } from 'react-icons/ri';
import './TripCalendarEdit.scss';

const TripCalendarEdit = ({ toggleEdit, confirmEdit, editing }) => {
    return (
        <Container className="trip-edit-controls">
            {!editing && (
                <>
                    <p className="edit-prompt">Edit your selections</p>
                    <button onClick={toggleEdit} className="edit-calendar-button">
                        <MdModeEditOutline />
                    </button>
                </>
            )}
            {editing && (
                <>
                    <button onClick={confirmEdit} className="edit-calendar-button confirm">
                        <RiCheckFill />
                    </button>
                    <button onClick={toggleEdit} className="edit-calendar-button close">
                        <RiCloseFill />
                    </button>
                </>
            )}
        </Container>
    );
};

export default TripCalendarEdit;
