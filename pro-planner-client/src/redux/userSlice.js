import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LOAD_STATUS } from '../constants';
import { buildServerRoute } from '../helpers/Utils';

export const getUserAsync = createAsyncThunk('user/get', async ({ planId }) => {
	const response = await axios.get(buildServerRoute(`user?eventId=${planId}`));
	return response.data;
});

export const addUserAsync = createAsyncThunk(
	'user/add',
	async ({ planId, newUser }) => {
		await axios.put(buildServerRoute('user'), {
			eventId: planId,
			userName: newUser,
		});
		return newUser;
	}
);

const userSlice = createSlice({
	name: 'user',
	initialState: {
		userList: [],
		selectedUser: null,
		loadStatus: null,
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
		builder.addCase(getUserAsync.pending, state => {
			state.pollStatus = LOAD_STATUS.LOADING;
		});
		builder.addCase(getUserAsync.fulfilled, (state, action) => {
			state.userList = action.payload;
			state.pollStatus = LOAD_STATUS.SUCCESS;
		});
		builder.addCase(getUserAsync.rejected, state => {
			state.pollStatus = LOAD_STATUS.FAILED;
		});
		builder.addCase(addUserAsync.pending, (state, action) => {
			state.pollStatus = LOAD_STATUS.LOADING;
		});
		builder.addCase(addUserAsync.fulfilled, (state, action) => {
			state.userList.push(action.payload);
			state.pollStatus = LOAD_STATUS.SUCCESS;
		});
		builder.addCase(addUserAsync.rejected, (state, action) => {
			state.pollStatus = LOAD_STATUS.FAILED;
		});
	},
});

export const { addUser, selectUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
