import {createSlice} from "@reduxjs/toolkit";

const pollSlice = createSlice({
    name: 'poll',
    initialState: {
        polls: []
    },
    reducers: {
        addPoll: (state, action) => {
            const input = action.payload;
            const newPoll = {
                pollId: input.pollId,
                question: input.question,
                options: input.options,
            };
            state.polls.push(newPoll);
        },
        addOption: (state, action) => {
            const input = action.payload;
            const newOption = {
                optionId: input.optionId,
                option: input.option,
                voteCount: input.voteCount
            }
            const poll = state.polls.find((p) => p.pollId === input.pollId);
            poll.options.push(newOption);
        },
        voteOption: (state, action) => {
            const input = action.payload;
            input.selectedOptions.forEach((optionId) => {
                const poll = state.polls.find((p) => p.pollId === input.pollId);
                poll.options.find((o) => o.optionId === optionId).voteCount++
            })
        },
    }
})

export const {addPoll, addOption, voteOption} = pollSlice.actions;
export default pollSlice.reducer;