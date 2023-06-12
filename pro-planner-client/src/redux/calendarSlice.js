import { createSlice } from '@reduxjs/toolkit';

const calendarSlice = createSlice({
	name: 'calendar',
	initialState: {
		user1: [
			[new Date('July 2, 2010 06:00:00'), new Date("July 4, 2010 06:00:00")],
			[new Date('July 6, 2010 18:00:00'), new Date("July 9, 2010 18:00:00")],
		],
		user2: [],
	},
	reducers: {},
});

// export const { changePlanType, updatePlan } = calendarSlice.actions;
export default calendarSlice.reducer;
