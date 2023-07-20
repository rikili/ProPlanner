import { Container } from 'react-bootstrap';
import { getHalfDate } from '../helpers/TripCalendar';
import TripHalfDay from './TripHalfDay';
import LoadingDisplay from './LoadingDisplay';

const TripDay = ({
    fake,
    date,
    selections,
    editable,
    onMouseEnter,
    onClick,
    maxUsers,
    isSelected,
    checkValid,
    checkPreview,
    className,
}) => {

    if (fake) return <div className={`${className} fake-day`} />

    const firstHalfDate = getHalfDate(date, true);
    const secHalfDate = getHalfDate(date, false);

    return (
        <Container className="trip-half-container" key={`day-container`}>
            <TripHalfDay
                topHalf={true}
                date={date}
                editable={editable}
                onMouseEnter={() => onMouseEnter(firstHalfDate)}
                onClick={() => onClick(firstHalfDate)}
                selections={editable ? null : selections[0]}
                maxUsers={maxUsers}
                isSelected={editable ? isSelected.first : null}
                isValid={checkValid(firstHalfDate)}
                isPreviewed={checkPreview(firstHalfDate)}
                className={className}
                key={`day-first`}
            />
            <TripHalfDay
                date={date}
                editable={editable}
                onMouseEnter={() => onMouseEnter(secHalfDate)}
                onClick={() => onClick(secHalfDate)}
                selections={editable ? null : selections[1]}
                maxUsers={maxUsers}
                isSelected={editable ? isSelected.second : null}
                isValid={checkValid(secHalfDate)}
                isPreviewed={checkPreview(secHalfDate)}
                className={className}
                key={`day-second`}
            />
        </Container>
    );
};

export default TripDay;
