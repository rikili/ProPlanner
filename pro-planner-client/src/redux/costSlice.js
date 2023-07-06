import {createSlice} from "@reduxjs/toolkit";

const costSlice = createSlice({
    name: 'cost',
    initialState: {
        users: {
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
            user3: {
                userName: 'User 3',
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
            }
        }
    }
})

export default costSlice.reducer;
