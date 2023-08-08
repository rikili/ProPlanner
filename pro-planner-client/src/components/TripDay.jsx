import { getHalfDate } from '../helpers/TripCalendar';
import TripHalfDay from './TripHalfDay';
import { useSelector } from 'react-redux';

const TripDay = ({
    fake,
    date,
    selections,
    editing,
    deciding,
    decisionSelect,
    onMouseEnter,
    onClick,
    maxUsers,
    isSelected,
    checkValid,
    checkPreview,
    className,
    selectedUser,
}) => {
    const decisionRange = useSelector((state) => state.planParameters.decisionRange);

    if (fake) return <div className={`${className} fake-day`} />;

    const firstHalfDate = getHalfDate(date, true);
    const secHalfDate = getHalfDate(date, false);

    const inDecisionRange = (date) => {
        if (!decisionRange.length) return false;
        if (deciding) return false;
        return new Date(decisionRange[0]) <= date && date <= new Date(decisionRange[1]);
    };

    const inDecisionSelect = (date) => {
        if (!decisionSelect) return false;
        return decisionSelect[0] <= date && date <= decisionSelect[1];
    };

    // responsible for filtering based on user selected in the sidebar.
    if (selectedUser) {
        let result = [];
        if (selections) {
            for (let selection of selections) {
                selection = selection.filter((user) => user === selectedUser);
                result.push(selection);
            }
            selections = result;
        }
    }

    return (
        <div className="trip-half-container" key={`day-container`}>
            <TripHalfDay
                topHalf={true}
                date={firstHalfDate}
                editing={editing}
                deciding={deciding}
                isDecisionSelect={inDecisionSelect(firstHalfDate)}
                onMouseEnter={() => onMouseEnter(firstHalfDate)}
                onClick={() => onClick(firstHalfDate)}
                selections={editing ? null : selections[0]}
                maxUsers={maxUsers}
                isDecided={inDecisionRange(firstHalfDate)}
                isSelected={editing ? isSelected.first : null}
                isValid={checkValid(firstHalfDate)}
                isPreviewed={checkPreview(firstHalfDate)}
                className={className}
                isFiltered={!!selectedUser}
                key={`day-first`}
            />
            <TripHalfDay
                date={secHalfDate}
                editing={editing}
                deciding={deciding}
                isDecisionSelect={inDecisionSelect(secHalfDate)}
                onMouseEnter={() => onMouseEnter(secHalfDate)}
                onClick={() => onClick(secHalfDate)}
                selections={editing ? null : selections[1]}
                maxUsers={maxUsers}
                isDecided={inDecisionRange(secHalfDate)}
                isSelected={editing ? isSelected.second : null}
                isValid={checkValid(secHalfDate)}
                isPreviewed={checkPreview(secHalfDate)}
                className={className}
                isFiltered={!!selectedUser}
                key={`day-second`}
            />
        </div>
    );
};

export default TripDay;
