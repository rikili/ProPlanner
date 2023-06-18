import {createSlice} from "@reduxjs/toolkit";

const pollSlice = createSlice({
    name: 'poll',
    initialState: {
        polls: [],
        votedUsers: {}
    },
    reducers: {
        addPoll: (state, action) => {
            const input = action.payload;
            const newPoll = {
                pollId: input.pollId,
                question: input.question,
                options: input.options,
                votedUsers: input.votedUsers
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

            const poll = state.polls.find((p) => p.pollId === input.pollId);
            const userVoted = poll.votedUsers[input.userId];

            if (!userVoted) {
                input.selectedOptions.forEach((optionId) => {
                    poll.options.find((o) => o.optionId === optionId).voteCount++
                })
            }

            poll.votedUsers[input.userId] = true;

        },
    }
})

export const {addPoll, addOption, voteOption} = pollSlice.actions;
export default pollSlice.reducer;