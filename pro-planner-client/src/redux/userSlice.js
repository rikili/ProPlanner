import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { LOAD_STATUS } from '../constants';
import { buildServerRoute } from '../helpers/Utils';

export const getUserAsync = createAsyncThunk('user/get', async ({ planId }) => {
	const response = await axios.get(buildServerRoute(`user?eventId=${planId}`));
	// console.log('got the response!', response.data);
	return response.data;
});

export const addUserAsync = createAsyncThunk(
	'user/add',
	async ({ planId, newUser }) => {
		const response = await axios.put(buildServerRoute('user'), {
			eventId: planId,
			userName: newUser,
		});
		return newUser;
	}
);

// export const addUserAsync = createAsyncThunk()

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
		resetUser: state => {
			state.selectedUser = null;
		},
	},
	extraReducers: builder => {
		/* TODO: Complete the pending and rejected cases */
		// builder.addCase(getUserAsync.pending, state => {});
		builder.addCase(getUserAsync.fulfilled, (state, action) => {
			state.userList = action.payload;
		});
		builder.addCase(addUserAsync.fulfilled, (state, action) => {
			state.userList.push(action.payload);
		});
		// builder.addCase(getUserAsync.rejected, state => {
		// 	console.log('error');
		// });
	},
});

export const { addUser, selectUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
