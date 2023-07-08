import {createSlice} from "@reduxjs/toolkit";

const costSlice = createSlice({
    name: 'cost',
    initialState: {
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
                    amount: 220
                },
                expense2: {
                    item: "Coffee",
                    amount: 10
                }
            },
        }
    },
    reducers: {
        addExpense: (state, action) => {
            const input = action.payload;
            const newExpense = {
                item: input.newItem,
                amount: input.newItemAmount
            }
            state[input.userId].expenses[input.expenseId] = newExpense
        },
        removeExpense: (state, action) => {
            const input = action.payload;
            delete state[input.userId].expenses[input.expenseId];
        }
    }
})

export const {addExpense, removeExpense} = costSlice.actions;
export default costSlice.reducer;
