import { createSlice } from '@reduxjs/toolkit';

const calendarSlice = createSlice({
	name: 'calendar',
	initialState: {
		user1: {
			'5-2023': [[true, false], [true, true], [true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, false],[false, false],[false, false],[false, false],[false, false],[false, false],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[false, false],[true, false], [true, true]],
			'6-2023': [[true, false], [false, false], [true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true]],
			'7-2023': [[true, false], [true, true], [false, false],[false, false],[false, false],[false, false],[false, false],[false, false],[false, false],[false, false],[false, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true]],
			'8-2023': [[true, false], [true, true], [false, false],[false, false],[false, false],[false, false],[false, false],[false, false],[false, false],[false, false],[false, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true],[true, true]],
		},
	},
	reducers: {
		setUserSelections(state, action) {
			const { user, selections } = action.payload;
			state[user] = selections;
		},
	},
});

export const { setUserSelections } = calendarSlice.actions;
export default calendarSlice.reducer;
