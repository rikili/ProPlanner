import { createSlice } from '@reduxjs/toolkit';

const outingSlice = createSlice({
	name: 'calendar',
	initialState: {
        user1: {
            '06-2023': {
                1: [["00:00", "3:00"], ["5:00",  "7:00"]],
                2: [["21:00", "23:59"]],
                3: [["00:00", "01:00"], ["02:00","03:00"], ["20:00", "21:00"], ["22:00", "23:00"]]
            }
        },
        user2: {
            '06-2023': {
                1: [["00:00", "3:00"], ["5:00",  "7:00"]],
                3: [["00:00", "3:00"], ["5:00",  "7:00"]]
            }
        },
        user3: {
            '06-2023': {
                1: [["00:00", "3:00"], ["5:00",  "7:00"]],
                5: [["00:00", "3:00"], ["5:00",  "7:00"]]
            }
        },
    },
	reducers: {
		setUserSelections(state, action) {
			const { user, selections } = action.payload;
			state[user] = selections;
		},
	},
});

export const { setUserSelections } = outingSlice.actions;
export default outingSlice.reducer;
