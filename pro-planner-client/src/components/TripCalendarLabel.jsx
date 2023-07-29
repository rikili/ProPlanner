import { Container } from 'react-bootstrap';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { format, startOfMonth, subMonths, addMonths } from 'date-fns';
import { assembleClass } from '../helpers/Utils';
import './CalendarLabel.scss';

const TripCalendarLabel = ({ date, startRange, endRange, onClick }) => {

    const isAtRangeStart = subMonths(date, 1) <= startOfMonth(subMonths(startRange, 1));
    const isAtRangeEnd = addMonths(date, 1) >= startOfMonth(addMonths(endRange, 1));

    const prevMonthClass = assembleClass(
        'nav-button',
        isAtRangeStart && 'nav-disabled',
    );

    const nextMonthClass = assembleClass(
        'nav-button',
        isAtRangeEnd && 'nav-disabled',
    );

    return (
        <Container>
            <div className="calendar-control">
                <button onClick={() => onClick(false)} className={prevMonthClass}>
                    <IoIosArrowBack />
                </button>
                <div className="calendar-labels">
                    <span className="calendar-label calendar-label-year">{date.getFullYear()}</span>
                    <span className="calendar-label">{format(date, 'MMMM')}</span>
                </div>
                <button onClick={() => onClick(true)} className={nextMonthClass}>
                    <IoIosArrowForward />
                </button>
            </div>
        </Container>
    );
};

export default TripCalendarLabel;
