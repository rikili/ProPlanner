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
        selections: {
            user1: {
                '0-2023': [[false, true], [true, true], [true, true], [false, true], [false, true], [true, false], [true, true], [true, true], [false, true], [false, false], [false, false], [false, false], [false, false], [false, false], [false, true], [false, false], [false, false], [true, false], [true, true], [false, true], [true, true], [true, false], [true, true], [false, false], [true, true], [false, true], [true, false], [false, false], [true, false], [false, false], [true, false]],
                '1-2023': [[true, true], [true, false], [true, false], [true, false], [false, true], [false, true], [false, false], [true, true], [false, true], [true, true], [true, true], [false, false], [false, false], [true, true], [true, true], [true, false], [false, true], [true, true], [false, true], [false, false], [true, true], [false, true], [false, true], [true, true], [true, true], [false, false], [true, false], [true, false]],
                '2-2023': [[true, false], [false, true], [false, false], [false, true], [false, true], [true, true], [true, true], [true, false], [false, false], [true, true], [true, false], [true, false], [false, false], [true, true], [true, true], [false, false], [false, true], [true, true], [true, false], [true, true], [true, true], [true, false], [true, true], [false, true], [true, false], [true, false], [false, true], [false, true], [true, true], [true, true], [false, true]],
                '3-2023': [[false, false], [true, false], [true, true], [false, true], [false, true], [false, true], [true, false], [true, false], [false, true], [false, false], [false, true], [true, true], [true, false], [false, false], [true, true], [true, true], [true, false], [true, true], [false, false], [false, true], [true, true], [false, true], [true, true], [false, true], [false, true], [true, true], [false, true], [false, false], [false, false], [true, false]],
                '4-2023': [[false, true], [true, false], [false, false], [true, true], [false, false], [false, false], [false, true], [false, true], [true, true], [true, true], [false, true], [false, false], [true, false], [true, true], [true, true], [false, false], [false, false], [false, true], [true, true], [false, true], [true, false], [false, true], [true, false], [true, true], [true, true], [true, false], [false, true], [false, true], [true, false], [true, false], [false, false]],
                '5-2023': [[false, false], [false, false], [false, false], [false, true], [true, true], [false, false], [false, false], [false, false], [false, true], [true, true], [false, true], [true, false], [true, false], [true, true], [false, true], [true, false], [false, false], [true, false], [true, false], [true, true], [true, true], [false, false], [true, false], [true, true], [false, false], [false, false], [true, true], [false, false], [false, true], [true, true]],
                '6-2023': [[false, true], [true, false], [false, true], [true, true], [false, false], [false, false], [true, true], [false, true], [false, true], [true, false], [true, true], [false, false], [true, false], [true, false], [true, false], [false, true], [false, false], [false, true], [true, false], [false, true], [false, true], [false, false], [false, true], [false, false], [false, true], [false, false], [false, false], [true, false], [true, false], [true, true], [false, false]],
                '7-2023': [[false, false], [false, false], [true, true], [false, true], [true, false], [false, true], [true, true], [true, false], [false, true], [false, true], [true, true], [true, false], [false, false], [true, false], [false, true], [false, false], [true, true], [false, false], [false, false], [false, true], [false, false], [true, true], [true, true], [false, false], [false, true], [false, true], [false, true], [true, false], [true, false], [false, true], [false, true]],
                '8-2023': [[true, false], [false, true], [false, false], [false, true], [false, true], [false, false], [true, false], [true, true], [true, false], [true, true], [false, false], [false, false], [false, true], [false, false], [true, true], [true, false], [false, true], [false, false], [false, false], [true, false], [false, false], [false, false], [false, true], [false, false], [false, true], [false, false], [false, false], [true, false], [true, false], [false, true]],
                '9-2023': [[false, false], [false, false], [true, false], [true, false], [false, true], [true, true], [false, true], [false, false], [true, true], [false, false], [true, true], [true, false], [true, false], [true, false], [false, false], [true, true], [false, true], [true, false], [false, true], [false, false], [false, true], [true, false], [false, false], [false, true], [true, false], [false, true], [false, false], [true, false], [false, false], [true, false], [true, true]],
                '10-2023': [[false, false], [false, true], [true, true], [true, true], [true, true], [true, false], [false, true], [false, false], [false, false], [false, true], [true, false], [false, true], [false, false], [true, false], [true, false], [false, false], [false, false], [true, false], [false, true], [false, true], [true, true], [true, false], [false, false], [false, false], [true, false], [false, true], [false, false], [true, false], [false, true], [true, true]],
                '11-2023': [[true, false], [false, true], [false, false], [true, true], [false, false], [false, true], [true, false], [false, true], [false, false], [true, true], [true, true], [false, false], [false, false], [false, true], [true, false], [true, true], [false, true], [false, true], [true, false], [true, true], [true, true], [true, false], [false, true], [false, true], [true, true], [true, true], [true, true], [true, false], [false, true], [false, true], [true, true]],
            },
            // user2: {
            //     '0-2023': [[false, false], [false, false], [true, true], [false, false], [true, false], [false, true], [false, true], [false, true], [false, false], [false, false], [false, true], [true, true], [true, true], [false, true], [true, false], [false, true], [false, false], [true, false], [true, false], [true, true], [true, true], [true, true], [false, true], [true, false], [true, false], [false, true], [false, false], [false, false], [true, false], [false, false], [true, true]],
            //     '1-2023': [[true, true], [true, true], [true, false], [false, false], [false, false], [false, false], [true, true], [false, false], [true, false], [false, true], [true, false], [true, true], [false, true], [false, true], [false, false], [true, true], [false, false], [true, false], [true, true], [true, false], [false, false], [false, true], [false, false], [false, false], [true, false], [false, true], [false, false], [true, true]],
            //     '2-2023': [[true, false], [true, true], [false, false], [false, false], [false, false], [true, true], [false, false], [true, true], [true, false], [false, true], [true, true], [true, true], [true, true], [false, true], [true, true], [true, true], [true, false], [false, true], [true, false], [true, true], [true, false], [false, false], [true, false], [true, true], [true, false], [false, true], [true, true], [true, false], [true, true], [true, true], [true, false]],
            //     '3-2023': [[true, false], [false, false], [false, false], [true, true], [true, false], [true, true], [true, false], [true, true], [false, false], [true, true], [false, true], [true, false], [false, false], [true, true], [true, false], [false, false], [true, true], [true, false], [true, false], [false, false], [true, false], [true, true], [true, false], [true, true], [true, false], [true, true], [false, false], [false, true], [true, true], [false, true]],
            //     '4-2023': [[true, true], [true, true], [true, false], [true, true], [false, false], [true, true], [true, false], [false, false], [true, false], [true, false], [false, false], [true, true], [false, false], [false, true], [true, false], [true, true], [true, true], [true, true], [true, false], [true, true], [true, true], [true, false], [true, true], [true, true], [false, false], [false, false], [false, true], [false, false], [true, false], [true, false], [true, false]],
            //     '5-2023': [[false, true], [true, true], [false, true], [false, true], [false, true], [false, false], [false, false], [false, false], [false, true], [false, false], [false, true], [false, false], [true, true], [true, true], [true, true], [true, false], [false, true], [true, false], [true, true], [false, false], [true, true], [false, false], [false, true], [true, true], [false, true], [false, false], [false, true], [false, true], [true, true], [true, false]],
            //     '6-2023': [[true, false], [true, false], [true, false], [false, true], [true, false], [false, true], [true, true], [false, true], [true, false], [false, false], [false, true], [true, false], [false, false], [true, false], [true, true], [false, true], [true, true], [true, false], [false, true], [true, true], [true, false], [true, false], [true, false], [false, false], [true, false], [true, false], [true, true], [false, false], [false, false], [true, false], [false, true]],
            //     '7-2023': [[false, true], [true, true], [true, false], [false, false], [true, false], [true, true], [false, true], [false, false], [true, false], [false, false], [false, true], [true, false], [true, true], [true, true], [true, false], [true, true], [false, false], [true, false], [false, true], [false, false], [false, true], [true, false], [false, false], [true, false], [true, false], [true, true], [true, true], [false, false], [false, false], [false, false], [false, false]],
            //     '8-2023': [[true, false], [true, false], [false, false], [false, true], [false, true], [false, false], [true, true], [true, true], [true, true], [false, false], [true, true], [true, false], [false, false], [true, true], [true, false], [true, true], [true, false], [false, false], [false, false], [true, false], [false, true], [false, false], [false, true], [true, true], [false, true], [false, true], [true, true], [false, false], [true, true], [true, true]],
            //     '9-2023': [[false, false], [false, false], [true, false], [true, true], [true, false], [true, true], [true, false], [false, true], [false, true], [true, false], [true, true], [true, false], [true, false], [true, true], [true, true], [true, false], [true, true], [false, false], [false, false], [true, false], [true, true], [false, true], [false, false], [false, false], [false, true], [true, true], [true, true], [true, true], [false, true], [true, true], [false, false]],
            //     '10-2023': [[false, false], [true, false], [true, true], [true, true], [true, false], [true, false], [true, true], [true, false], [true, true], [true, true], [false, false], [true, false], [true, false], [true, true], [true, false], [false, true], [true, true], [false, true], [true, false], [true, true], [false, false], [false, true], [true, false], [false, false], [false, true], [true, false], [true, true], [false, true], [true, true], [false, true]],
            //     '11-2023': [[false, true], [false, true], [false, true], [false, false], [false, true], [true, true], [false, false], [false, true], [false, false], [true, false], [false, true], [true, false], [true, false], [true, false], [false, false], [false, false], [false, false], [true, false], [true, false], [false, true], [false, true], [false, true], [true, false], [true, false], [false, false], [true, true], [true, true], [true, false], [true, false], [true, false], [false, false]],
            // },
        }
	},
	reducers: {
        setUserSelections(state, action) {
            const {userId, monthIndex, data} = action.payload;
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
            state.selections[userId][monthIndex] = data.month;
        });
    }
});

export const { setUserSelections, setLoading, completeInit } = tripSlice.actions;
export default tripSlice.reducer;
