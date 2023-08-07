import { Container } from 'react-bootstrap';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { format } from 'date-fns';
import { assembleClass } from '../helpers/Utils';
import './CalendarLabel.scss';

const OutingCalendarLabel = ({ dateRange, isPrevDisabled, isNextDisabled, onClick }) => {
    const prevMonthClass = assembleClass('nav-button', isPrevDisabled && 'nav-disabled');

    const nextMonthClass = assembleClass('nav-button', isNextDisabled && 'nav-disabled');

    return (
        <Container>
            <div className="calendar-control">
                <button onClick={() => onClick(false)} className={prevMonthClass}>
                    <IoIosArrowBack />
                </button>
                <div className="calendar-labels">
                    <div className="calendar-outing-year">{format(dateRange[0], 'yyyy')}</div>
                    <div className="calendar-outing-label">
                        <span>{format(dateRange[0], 'MMM dd')}</span>
                        <span>{' - '}</span>
                        <span>{format(dateRange[1], 'MMM dd')}</span>
                    </div>
                </div>
                <button onClick={() => onClick(true)} className={nextMonthClass}>
                    <IoIosArrowForward />
                </button>
            </div>
        </Container>
    );
};

export default OutingCalendarLabel;
