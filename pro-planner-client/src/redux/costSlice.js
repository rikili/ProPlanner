import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LOAD_STATUS } from '../constants';
import { buildServerRoute } from '../helpers/Utils';

export const getCostAsync = createAsyncThunk('cost/get', async ({ tripId }) => {
    const response = await axios.get(buildServerRoute('cost', tripId));
    return response.data;
});

export const addExpenseAsync = createAsyncThunk(
    'cost/addExpense',
    async ({ tripId, userId, newItem, newItemAmount }) => {
        const data = {
            userName: userId,
            itemName: newItem,
            itemAmount: newItemAmount,
        };
        const response = await axios.put(buildServerRoute('cost', 'addExpense', tripId), data);
        return response.data;
    }
);

export const removeExpenseAsync = createAsyncThunk(
    'cost/removeExpense',
    async ({ tripId, userId, expenseId }) => {
        const data = {
            userName: userId,
            expenseId: expenseId,
        };

        const response = await axios.put(buildServerRoute('cost', 'removeExpense', tripId), data);
        return response.data;
    }
);

export const updateCostAsync = createAsyncThunk(
    'cost/removeUser',
    async ({ planId, usersToDelete }) => {
        const response = await axios.patch(buildServerRoute('cost', 'removeUser', planId), {
            userToDelete: usersToDelete,
        });
        return response.data;
    }
);

const costSlice = createSlice({
    name: 'cost',
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCostAsync.pending, (state) => {
            state.costsStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(getCostAsync.fulfilled, (state, action) => {
            state.costs = action.payload.costs;
            state.costsStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(getCostAsync.rejected, (state) => {
            state.costsStatus = LOAD_STATUS.FAILED;
        });

        builder.addCase(addExpenseAsync.pending, (state) => {
            state.costsStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(addExpenseAsync.fulfilled, (state, action) => {
            const { costs } = action.payload;
            Object.entries(costs).forEach(([userName, expenses]) => {
                state.costs[userName] = expenses;
            });
            state.costsStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(addExpenseAsync.rejected, (state) => {
            state.costsStatus = LOAD_STATUS.FAILED;
        });

        builder.addCase(removeExpenseAsync.pending, (state) => {
            state.costsStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(removeExpenseAsync.fulfilled, (state, action) => {
            state.costs = action.payload.costs;
            state.costsStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(removeExpenseAsync.rejected, (state) => {
            state.costsStatus = LOAD_STATUS.FAILED;
        });

        builder.addCase(updateCostAsync.fulfilled, (state) => {
            state.costsStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(updateCostAsync.rejected, (state) => {
            state.costsStatus = LOAD_STATUS.FAILED;
        });
    },
});

export const { addExpense, removeExpense, addUser } = costSlice.actions;
export default costSlice.reducer;
