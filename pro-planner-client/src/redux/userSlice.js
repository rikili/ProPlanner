import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userList: ['user1'],
        selectedUser: null,
    },
    reducers: {
        addUser: (state, action) => {
            state.userList.push(action.payload);
        },
        selectUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        resetUser: (state) => {
            state.selectedUser = null;
        }
    }
});

export const {addUser, selectUser, resetUser} = userSlice.actions;
export default userSlice.reducer;
