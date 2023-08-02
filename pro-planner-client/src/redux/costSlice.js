import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { LOAD_STATUS } from "../constants";
import axios from "axios";
import { buildServerRoute } from "../helpers/Utils";

export const getCostAsync = createAsyncThunk('cost/get', async({tripId}) => {
    const response = await axios.get(buildServerRoute('cost', tripId));
    return response.data;
});

export const addExpenseAsync = createAsyncThunk('cost/addExpense', async({tripId, userId, newItem, newItemAmount}) => {
    const data = {
        userName: userId,
        itemName: newItem,
        itemAmount: newItemAmount
    }

    const response = await axios.put(buildServerRoute('cost', 'addExpense', tripId), data);
    return response.data;
});

export const removeExpenseAsync = createAsyncThunk('cost/removeExpense', async({tripId, userId, expenseId}) => {
    const data = {
        userName: userId,
        expenseId: expenseId
    }

    const response = await axios.put(buildServerRoute('cost', 'removeExpense', tripId), data);
    return response.data;
});

const costSlice = createSlice({
    name: 'cost',
    initialState: {
        costsID: null, 
        costsStatus: null,
        costs: {
            user1: {
                userName: 'User 1',
                expenses: {
                    expense1: {
                        item: "Go Kart tickets",
                        amount: 120
                    },
                    expense2: {
                        item: "Movies",
                        amount: 80
                    }
                },
            },
            user2: {
                userName: 'User 2',
                expenses: {},
            },
            user3: {
                userName: 'User 3',
                expenses: {
                    expense1: {
                        item: "PNE tickets",
                        amount: 200
                    },
                    expense2: {
                        item: "Coffee",
                        amount: 10
                    }
                },
            },
            user4: {
                userName: 'User 4',
                expenses: {
                    expense1: {
                        item: "Parking",
                        amount: 30
                    }
                },
            }  
        },
    },
    reducers: {
        addUser: (state, action) => {
            const input = action.payload
            const newUser = {
                userName: input.name,
                expenses: {}
            }
            state.costs[input.id] = newUser
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCostAsync.pending, (state, action) => {
            state.costsStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(getCostAsync.fulfilled, (state, action) => {
            state.costs = action.payload.costs;
            state.pollStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(getCostAsync.rejected, (state, action) => {
            state.pollStatus = LOAD_STATUS.FAILED;
        });
        builder.addCase(addExpenseAsync.pending, (state, action) => {
            state.costsStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(addExpenseAsync.fulfilled, (state, action) => {
            state.costs = action.payload.costs;
            state.pollStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(addExpenseAsync.rejected, (state, action) => {
            state.pollStatus = LOAD_STATUS.FAILED;
        });
        builder.addCase(removeExpenseAsync.pending, (state, action) => {
            state.costsStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(removeExpenseAsync.fulfilled, (state, action) => {
            state.costs = action.payload.costs;
            state.pollStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(removeExpenseAsync.rejected, (state, action) => {
            state.pollStatus = LOAD_STATUS.FAILED;
        });
    }
})

export const {addExpense, removeExpense, addUser} = costSlice.actions;
export default costSlice.reducer;
