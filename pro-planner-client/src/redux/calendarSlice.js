import { createSlice } from '@reduxjs/toolkit';

const calendarSlice = createSlice({
	name: 'calendar',
	initialState: {
		user1: [
			[new Date('June 1, 2023 06:00:00'), new Date("June 30, 2023 06:00:00")],
			[new Date('July 1, 2023 06:00:00'), new Date("July 31, 2023 06:00:00")]
			// [new Date('July 3, 2023 18:00:00'), new Date("July 9, 2023 18:00:00")]
		],
		user2: [
			[new Date('July 1, 2023 06:00:00'), new Date("July 31, 2023 06:00:00")]
		]
	},
	reducers: {},
});

// export const { changePlanType, updatePlan } = calendarSlice.actions;
export default calendarSlice.reducer;
