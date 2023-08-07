import { Container } from 'react-bootstrap';
import './TripWeekDayLabels.scss';

const TripWeekDayLabels = () => {
    return (
        <Container className="weekday-labels">
            <div className="weekday-label">Su</div>
            <div className="weekday-label">Mo</div>
            <div className="weekday-label">Tu</div>
            <div className="weekday-label">We</div>
            <div className="weekday-label">Th</div>
            <div className="weekday-label">Fr</div>
            <div className="weekday-label">Sa</div>
        </Container>
    );
};

export default TripWeekDayLabels;
