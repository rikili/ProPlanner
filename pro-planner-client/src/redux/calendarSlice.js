import { createSlice } from '@reduxjs/toolkit';

const calendarSlice = createSlice({
	name: 'parameters',
	initialState: {
		user1: [
			[new Date(2021, 5, 15), new Date(2021, 5, 20)],
			[new Date(2021, 5, 22), new Date(2021, 5, 26)],
		],
		user2: [],
	},
	reducers: {},
});

// export const { changePlanType, updatePlan } = calendarSlice.actions;
export default calendarSlice.reducer;
