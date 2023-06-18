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
                id: input.id,
                question: input.question,
                options: input.options,
            };
            state.polls.push(newPoll);
        },
        addOption: (state, action) => {
            const input = action.payload;
            const newOption = {
                option: input.option,
                voteCount: input.voteCount
            }
            const poll = state.polls.find((poll) => poll.id === input.pollId);
            poll.options.push(newOption);
        },
        voteOption: (state, action) => {
            const input = action.payload;
            input.selectedOptions.forEach((optionIndex) => {
                const poll = state.polls.find((poll) => poll.id === input.pollId);
                poll.options[optionIndex].voteCount++;
            })
        },
    }
})

export const {addPoll, addOption, voteOption} = pollSlice.actions;
export default pollSlice.reducer;