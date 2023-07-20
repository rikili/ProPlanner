import axios from 'axios';
import { buildServerRoute, getTimezone } from '../helpers/Utils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LOAD_STATUS } from '../constants';

export const setUserSelectionsAsync = createAsyncThunk('calendar/trip/update', async ({tripId, userId, newSelections, monthIndex}) => {
    const timezone = getTimezone();
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

const addSelectionToUser = (state, userId, monthIndex, monthSelects) => {
    if (!state.selections[userId]) {
        state.selections[userId] = { [monthIndex]: monthSelects };
    } else {
        state.selections[userId][monthIndex] = monthSelects;
    }
}

const tripSlice = createSlice({
	name: 'calendar',
	initialState: {
        isLoading: false,   // in loading state
        isInitDone: false,    // inital loading finished for user fetching
        updateStatus: null,
        selections: { },
        detailedDay: null,
        detailUsers: [],
	},
	reducers: {
        setUserSelections(state, action) {
            const {userId, monthIndex, data} = action.payload;
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
        setDetailedDay(state, action) {
            state.detailedDay = action.payload;
        },
        setDetailedUsers(state, action) {
            state.detailUsers = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setUserSelectionsAsync.pending, (state, action) => {
            const {userId, newSelections, monthIndex} = action.meta.arg;
            addSelectionToUser(state, userId, monthIndex, newSelections);
        });
        builder.addCase(setUserSelectionsAsync.fulfilled, (state, action) => {
            const {userId, monthIndex, data} = action.payload;
            addSelectionToUser(state, userId, monthIndex, data.month);
        });
        builder.addCase(setUserSelectionsAsync.rejected, (state) => {
            state.updateStatus = LOAD_STATUS.FAILED;
        });
    }
});

export const { setUserSelections, setLoading, completeInit, setDetailedDay, setDetailedUsers } = tripSlice.actions;
export default tripSlice.reducer;
