import axios from 'axios';
import { buildServerRoute } from '../helpers/Utils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const setUserSelectionsAsync = createAsyncThunk('calendar/trip/update', async ({tripId, userId, newSelections, monthIndex}) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await axios.put(buildServerRoute('trip',tripId), { 
        userId,
        timezone,
        selections: {
            [monthIndex] : newSelections,
        }
    });
    return {
        userId: userId,
        monthIndex: monthIndex,
        data: response.data
    };
});

const tripSlice = createSlice({
	name: 'calendar',
	initialState: {
        isLoading: false,   // in loading state
        isInitDone: false,    // inital loading finished for user fetching
        selections: { }
	},
	reducers: {
        setUserSelections(state, action) {
            const {userId, monthIndex, data} = action.payload;
            if (!state.selections[userId]) {
                state.selections[userId] = { };
            }
            state.selections[userId][monthIndex] = data;
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        completeInit(state) {
            state.isInitDone = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setUserSelectionsAsync.fulfilled, (state, action) => {
            const {userId, monthIndex, data} = action.payload;
            if (!state.selections[userId]) {
                state.selections[userId] = { [monthIndex]: data.month };
            } else {
                state.selections[userId][monthIndex] = data.month;
            }
        });
    }
});

export const { setUserSelections, setLoading, completeInit } = tripSlice.actions;
export default tripSlice.reducer;
