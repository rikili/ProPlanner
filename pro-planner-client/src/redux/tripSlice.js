import axios from 'axios';
import { buildServerRoute, getTimezone } from '../helpers/Utils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const setUserSelectionsAsync = createAsyncThunk(
	'trip/updateSelects',
	async ({ tripId, userId, newSelections, months }, { rejectWithValue }) => {
		const timezone = getTimezone();

		const promises = months.map(monthIndex =>
			axios.put(buildServerRoute('trip', tripId), {
				userId,
				timezone,
				selections: {
					[monthIndex]: newSelections[monthIndex],
				},
			})
		);

		const results = await Promise.allSettled(promises);

		let reject = false;
		const result = results.map(res => {
			if (!res.reason) return res;
			reject = true;
			return null;
		});

		const payloadData = {};

		result.forEach((res, index) => {
			if (!res) return;
			const monthIndex = months[index];
			payloadData[monthIndex] = res.value.data.month;
		});

		const payload = {
			userId: userId,
			data: payloadData,
		};
		return reject ? rejectWithValue(payload) : payload;
	}
);

const addSelectionToUser = (state, userId, monthIndex, monthSelects) => {
	if (!state.selections[userId]) {
		state.selections[userId] = { [monthIndex]: monthSelects };
	} else {
		state.selections[userId][monthIndex] = monthSelects;
	}
};

const tripSlice = createSlice({
	name: 'trip',
	initialState: {
		isLoading: false, // in loading state
		isInitDone: false, // inital loading finished for user fetching
		selections: {},
	},
	reducers: {
		setUserSelections(state, action) {
			const { userId, monthIndex, data } = action.payload;
			if (!state.selections[userId]) {
				state.selections[userId] = {};
			}
			state.selections[userId][monthIndex] = data;
		},
		setLoading(state, action) {
			state.isLoading = action.payload;
		},
		completeInit(state) {
			state.isInitDone = true;
		},

		clearTripSelections(state, action) {
			state.selections = {};
		},
	},
	extraReducers: builder => {
		builder.addCase(setUserSelectionsAsync.fulfilled, (state, action) => {
			const { userId, data } = action.payload;
			Object.entries(data).forEach(([monthIndex, selections]) => {
				addSelectionToUser(state, userId, monthIndex, selections);
			});
		});
		builder.addCase(setUserSelectionsAsync.rejected, (state, action) => {
			const { userId, data } = action.payload;
			Object.entries(data).forEach(([monthIndex, selections]) => {
				addSelectionToUser(state, userId, monthIndex, selections);
			});
		});
	},
});

export const {
	setUserSelections,
	setLoading,
	completeInit,
	clearTripSelections,
} = tripSlice.actions;
export default tripSlice.reducer;
