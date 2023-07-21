import { useState } from 'react';
import { eachMonthOfInterval, format, startOfYear, endOfYear, isSameMonth, addYears, subYears } from 'date-fns';
import { Container } from 'react-bootstrap';
import { assembleClass } from '../helpers/Utils';
import './TripMonthSelector.scss';

const TripMonthSelector = ({ selectedMonth, setSelectedMonth, rangeStart, rangeEnd }) => {
    const [viewYear, setViewYear] = useState(new Date(selectedMonth));

    const handleYearChange = (isForward) => {
        if (isForward) {
            setViewYear(addYears(viewYear, 1));
        } else {
            setViewYear(subYears(viewYear, 1));
        }
    };

    const isAtEarliestYear = () => subYears(viewYear, 1) < startOfYear(rangeStart);

    const isAtLatestYear = () => addYears(viewYear, 1) > startOfYear(rangeEnd);

    const inRange = (month) => {
        return (
            (month >= rangeStart && month <= rangeEnd) || isSameMonth(month, rangeStart) || isSameMonth(month, rangeEnd)
        );
    };

    return (
        <Container className="trip-month-selector">
            <div className="trip-year-selector">
                {!isAtEarliestYear && (
                    <button className="trip-year-select-button" onClick={() => handleYearChange(false)}>
                        {'<'}
                    </button>
                )}
                <div className="trip-year-selector-label">{format(viewYear, 'yyyy')}</div>
                {!isAtLatestYear && (
                    <button className="trip-year-select-button" onClick={() => handleYearChange(true)}>
                        {'>'}
                    </button>
                )}
            </div>
            <Container className="trip-month-list">
                {eachMonthOfInterval({ start: startOfYear(viewYear), end: endOfYear(viewYear) }).map((month) => {
                    const buttonClass = assembleClass(
                        'trip-month-button',
                        inRange(month) ? 'trip-month-button-valid' : 'trip-month-button-invalid',
                        isSameMonth(month, selectedMonth) && 'trip-month-button-selected'
                    );

                    return (
                        <div className={buttonClass} onClick={() => setSelectedMonth(month)} key={`month-selector-${format(month, 'MMMM')}`}>
                            {format(month, 'MMM')}
                        </div>
                    );
                })}
            </Container>
        </Container>
    );
};

export default TripMonthSelector;
