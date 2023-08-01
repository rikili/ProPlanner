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

    const response = await axios.post(buildServerRoute('cost', tripId), data);
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
        // addExpense: (state, action) => {
        //     const input = action.payload;
        //     const newExpense = {
        //         item: input.newItem,
        //         amount: input.newItemAmount
        //     }
        //     state.costs[input.userId].expenses[input.expenseId] = newExpense
        // },
        removeExpense: (state, action) => {
            const input = action.payload;
            delete state.costs[input.userId].expenses[input.expenseId];
        },
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
            console.log(state.costs)
            console.log(action.payload.costs)
            console.log(typeof action.payload.costs)
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
            // state.costs[action.payload.user] =
            // TODO
            state.pollStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(addExpenseAsync.rejected, (state, action) => {
            state.pollStatus = LOAD_STATUS.FAILED;
        });
        // put request to update a single user's expense (add/remove)
    }
})

export const {addExpense, removeExpense, addUser} = costSlice.actions;
export default costSlice.reducer;
