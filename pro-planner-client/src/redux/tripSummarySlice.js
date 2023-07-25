import { createSlice } from '@reduxjs/toolkit';

const tripSummarySlice = createSlice({
    name: 'tripSummary',
    initialState: {
        detailedDay: null,
        detailedUsers: [],
    },
    reducers: {
        setDetailedDay(state, action) {
            state.detailedDay = action.payload;
        },
        setDetailedUsers(state, action) {
            state.detailedUsers = action.payload;
        },
    },
});

export const { setDetailedDay, setDetailedUsers } = tripSummarySlice.actions;
export default tripSummarySlice.reducer;
