import { createSlice } from '@reduxjs/toolkit';

const summarySlice = createSlice({
    name: 'summary',
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

export const { setDetailedDay, setDetailedUsers } = summarySlice.actions;
export default summarySlice.reducer;
