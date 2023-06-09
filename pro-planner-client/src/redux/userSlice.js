import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    userList: ['User A', 'User B'],
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
    },
});

export const {addUser, selectUser} = userSlice.actions;

export default userSlice.reducer;
