import { eachMinuteOfInterval, format, isAfter, isWithinInterval, startOfDay, subMinutes, endOfDay } from "date-fns";
import { selectToInterval, getEndOfSegment, SEGMENT_TIME } from '../helpers/Outing';
import { assembleClass } from '../helpers/Utils';

import './OutingDay.scss';

const OutingDay = ({
    date,
    slots,
    selections,
    isFirstDay=false,
    onSegmentClick,
    onSegmentEnter,
    isEditing,
    editSelections,
    anchor,
    cursor,
}) => {
    const hasSlots = !!slots;
    let slotsIntervals;
    let userIntervals;
    let editIntervals;

    if (hasSlots) {
        slotsIntervals = slots.map(([start, end]) => {return {start, end: end.getMinutes() === 59 ? end : subMinutes(end, 1)}});

        if (isEditing) {
            if (editSelections) {
                editIntervals = editSelections.map(
                    (selectInterval) => selectToInterval(date, selectInterval)
                );
            }
        } else {
            userIntervals = {};
            Object.entries(selections).forEach(([username, selections]) => {
                if (selections) {
                    userIntervals[username] = selections.map(
                        (selectInterval) => selectToInterval(date, selectInterval)
                    );
                }
            });
        }
    }

    const inAnyInterval = (date, listOfInterval, reduceDefault = false) => {
        return listOfInterval.reduce((acc, interval) => acc || isWithinInterval(date, interval), reduceDefault);
    }

    const displaySegments = eachMinuteOfInterval({
        start: startOfDay(date),
        end: endOfDay(date)
    }, {step: SEGMENT_TIME})
        .map((segmentStart, index) => {
            let isSelected = false;
            const isHourStart = segmentStart.getMinutes() === 0;
            let segmentClass = assembleClass(
                !isHourStart && 'first-segment',
                isHourStart && 'second-segment',
                index === 0 && 'top-segment',
                isFirstDay && 'left-segment'
            );

            if (!hasSlots) {
                return <div
                    className={`${segmentClass} unavailable`}
                    key={format(segmentStart, 'dd-HH-mm')}
                />
            }
            if (!inAnyInterval(segmentStart, slotsIntervals)) {
                return <div
                    className={`${segmentClass} unavailable`}
                    key={format(segmentStart, 'dd-HH-mm')}
                />
            }
            
            if (isEditing) {
                if (editIntervals) {
                    isSelected = inAnyInterval(segmentStart, editIntervals);
                } else {
                    isSelected = false;
                }
            } else {
                isSelected = Object.entries(userIntervals)
                    .filter(([_, intervals]) => inAnyInterval(segmentStart, intervals))
                    .map(([user, _]) => user);
            }

            const isHovered = (anchor && cursor)
                && (isAfter(cursor, anchor))
                && isWithinInterval(segmentStart, {start: anchor, end: subMinutes(cursor, 1)});
            const isSelectedSegment = isEditing ? isSelected : !!isSelected.length; // TODO: refactor isSelected.length to accommodate multiple selects
            const isAvailable = isHovered || (isEditing ? !isSelected : !isSelected.length);

            segmentClass += ' ' + assembleClass(
                isAvailable && 'available',
                isHovered && 'hovered',
                !isHovered && isSelectedSegment && 'selected',
                isEditing && 'editable',
            );

            return <div
                key={`segment-${format(segmentStart, 'dd-HH-mm')}`}
                className={segmentClass}
                onClick={isEditing ? () => onSegmentClick(segmentStart, isSelected) : null}
                onMouseEnter={isEditing ? () => onSegmentEnter(getEndOfSegment(segmentStart)) : null}
            />
        });

    return <div className="d-flex flex-column week-calendar">
        {displaySegments.map((segment) => {
            return segment
        })}
    </div>
};

export default OutingDay;
