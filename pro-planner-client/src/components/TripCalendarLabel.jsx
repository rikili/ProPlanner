import { Container } from 'react-bootstrap';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { format } from 'date-fns';
import './TripCalendarLabel.scss';

const TripCalendarLabel = ({ date, onClick }) => {
    return (
        <Container>
            <div className="calendar-month-control">
                <button onClick={() => onClick(false)} className="month-nav">
                    <IoIosArrowBack />
                </button>
                <div className="calendar-month-labels">
                    <span className="calendar-label calendar-label-year">{date.getFullYear()}</span>
                    <span className="calendar-label">{format(date, 'MMMM')}</span>
                </div>
                <button onClick={() => onClick(true)} className="month-nav">
                    <IoIosArrowForward />
                </button>
            </div>
        </Container>
    );
};

export default TripCalendarLabel;
