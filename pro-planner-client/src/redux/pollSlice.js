import {createSlice} from "@reduxjs/toolkit";

const pollSlice = createSlice({
    name: 'poll',
    initialState: {
        polls: [],
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
            const votedUser = poll.votedUsers.find((u) => u.user === input.user);
            if (votedUser) {
                // user already voted before
                poll.options.find((o) => o.optionId === votedUser.votedOptionId).voteCount--
                votedUser.votedOptionId = input.selectedOption;
                poll.options.find((o) => o.optionId === input.selectedOption).voteCount++
            } else {
                poll.votedUsers.push({user: input.user, votedOptionId: input.selectedOption});
                poll.options.find((o) => o.optionId === input.selectedOption).voteCount++
            }
        },
    }
})

export const {addPoll, addOption, voteOption} = pollSlice.actions;
export default pollSlice.reducer;

