import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    userList: [
        {
            userName: 'User A',
        },
        {
            userName: 'User B',
        },
    ],
    selectedUser: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.userList.push(action.payload);
        },
        selectUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        navigateToCreationPage: (state) => {
            // Handle navigation to the creation page
        },
    },
});

export const {addUser, selectUser, navigateToCreationPage} = userSlice.actions;

export default userSlice.reducer;
