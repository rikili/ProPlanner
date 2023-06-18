import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userList: [],
        selectedUser: null,
    },
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
