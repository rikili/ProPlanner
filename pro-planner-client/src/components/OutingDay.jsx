import {
	eachMinuteOfInterval,
	format,
	isWithinInterval,
	startOfDay,
	subMinutes,
	endOfDay,
	isEqual,
} from 'date-fns';
import {
	selectToInterval,
	getEndOfSegment,
	SEGMENT_TIME,
	makeOutingDate,
} from '../helpers/OutingCalendar';
import { assembleClass } from '../helpers/Utils';

import { useDispatch, useSelector } from 'react-redux';
import { setDetailedDay, setDetailedUsers } from '../redux/summarySlice';
import { STEP_ARR } from '../helpers/Calendar';
import './OutingDay.scss';

const OutingDay = ({
	fake,
	date,
	slots,
	selections,
	isFirstDay = false,
	onSegmentClick,
	onSegmentEnter,
	isEditMode,
	isDeciding,
	isInSelect,
	editSelections,
	decisionPreview,
	maxUsers,
	selectedUser,
}) => {
	const dispatch = useDispatch();
	const decision = useSelector(state => state.planParameters.decisionRange).map(
		outingString => new Date(outingString)
	);
	const summaryState = useSelector(state => state.summary.detailedDay);
	const summaryDate = summaryState ? new Date(summaryState) : null;
	const isDecision = !!decision.length;

	// responsible for filtering based on user selected in the sidebar.
	if (selectedUser) {
		let result = [];
		if (selections) {
			for (let i in selections) {
				if (selections[i] && i === selectedUser) {
					result.push(selections[i]);
				}
			}
			selections = result;
		}
	}

	const segmentList = eachMinuteOfInterval(
		{
			start: startOfDay(date),
			end: endOfDay(date),
		},
		{ step: SEGMENT_TIME }
	);

	const hasSlots = !!slots;
	let slotsIntervals;
	let userIntervals;
	let editIntervals;

	if (!fake && hasSlots) {
		slotsIntervals = slots.map(([start, end]) => {
			return { start, end: end.getMinutes() === 59 ? end : subMinutes(end, 1) };
		});

		if (isEditMode) {
			if (editSelections) {
				editIntervals = editSelections.map(selectInterval =>
					selectToInterval(date, selectInterval)
				);
			}
		} else {
			userIntervals = {};
			Object.entries(selections).forEach(([username, selections]) => {
				if (selections) {
					userIntervals[username] = selections.map(selectInterval =>
						selectToInterval(date, selectInterval)
					);
				}
			});
		}
	}

	const inAnyInterval = (date, listOfInterval, reduceDefault = false) => {
		return listOfInterval.reduce(
			(acc, interval) => acc || isWithinInterval(date, interval),
			reduceDefault
		);
	};

	const displaySegments = segmentList.map(segmentStart => {
		let isSelected = false;
		let segmentClass = assembleClass('segment', isFirstDay && 'left-segment');

		if (!hasSlots || fake || !inAnyInterval(segmentStart, slotsIntervals)) {
			return (
				<div
					className={`${segmentClass} unavailable`}
					key={format(segmentStart, 'dd-HH-mm')}
				/>
			);
		}

		if (isEditMode) {
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

		const isSummaryDate = isEqual(segmentStart, summaryDate);
		const inSelection = (isEditMode || isDeciding) && isInSelect(segmentStart);
		const isSelectedSegment = isEditMode ? isSelected : !!isSelected.length; // TODO: refactor isSelected.length to accommodate multiple selects
		const inDecidedRange = segment =>
			decision[0] <= segment && segment < decision[1];
		const inDecidedSelect = segment =>
			decisionPreview[0] <= segment && segment < decisionPreview[1];

		const handleClick = () => {
			if (isEditMode || isDeciding) {
				onSegmentClick(segmentStart, isSelected);
			} else {
				if (isSummaryDate) {
					dispatch(setDetailedDay(null));
					dispatch(setDetailedUsers([]));
				} else {
					dispatch(setDetailedDay(makeOutingDate(segmentStart)));
					dispatch(setDetailedUsers([...isSelected]));
				}
			}
		};

		let step;
		const ratio = isSelected.length / maxUsers;
		step = STEP_ARR.reduce((acc, [lower, upper], index) => {
			if (acc === null) {
				if (ratio >= lower && ratio <= upper) {
					return index + 1;
				}
			}
			return acc;
		}, null);
		const segmentLogic = () => {
			if (isEditMode) {
				return assembleClass(
					'available',
					inSelection ? 'editing' : isSelectedSegment && `outing-edit-select`
				);
			} else if (isDeciding) {
				return assembleClass(
					'available',
					inSelection
						? 'deciding-selection'
						: isSelectedSegment && `outing-selected-${step}`,
					decisionPreview && inDecidedSelect(segmentStart) && 'outing-decided-4'
				);
			} else {
				const isSegmentInDecision = inDecidedRange(segmentStart);
				return assembleClass(
					'available',
					isSummaryDate && 'summary',
					!isSegmentInDecision &&
						isSelectedSegment &&
						`outing-selected-${step}`,
					isDecision && isSegmentInDecision && `outing-decided-${step}`
				);
			}
		};

		return (
			<div
				key={`segment-${format(segmentStart, 'dd-HH-mm')}`}
				className={`${segmentClass} ${segmentLogic()}`}
				onClick={handleClick}
				onMouseEnter={
					isEditMode || isDeciding
						? () => onSegmentEnter(getEndOfSegment(segmentStart))
						: null
				}
			/>
		);
	});

	return (
		<div className="d-flex flex-column day-container">
			{displaySegments.map(segment => {
				return segment;
			})}
		</div>
	);
};

export default OutingDay;
