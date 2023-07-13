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
        },
        addUser: (state, action) => {
            const input = action.payload
            const newUser = {
                userName: input.name,
                expenses: {}
            }
            state[input.id] = newUser
        }
    }
})

export const {addExpense, removeExpense, addUser} = costSlice.actions;
export default costSlice.reducer;
