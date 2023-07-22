import axios from 'axios';
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {buildServerRoute} from "../helpers/Utils";

export const addPollAsync = createAsyncThunk(
    'poll/add',
    async ({newQuestion}) => {
        const response = await axios.put(buildServerRoute('poll'), {
            question: newQuestion,
            options: {},
            votedUsers: []
        });
        return response.data;
    });


const pollSlice = createSlice({
    name: 'poll',
    initialState: {
        polls: {},
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
            state.polls[input.pollId] = newPoll;
        },
        addOption: (state, action) => {
            const input = action.payload;
            const newOption = {
                optionId: input.optionId,
                option: input.option,
                voteCount: input.voteCount
            }
            const poll = state.polls[input.pollId];
            poll.options[input.optionId] = newOption;
        },
        voteOption: (state, action) => {
            const input = action.payload;
            const poll = state.polls[input.pollId];
            const votedUser = poll.votedUsers.find((u) => u.user === input.user);
            if (votedUser) {
                poll.options[votedUser.votedOptionId].voteCount-- // decrement previous voted option count
                votedUser.votedOptionId = input.selectedOption; // update voted option
                poll.options[input.selectedOption].voteCount++ // increment current voted option count
            } else {
                poll.votedUsers.push({user: input.user, votedOptionId: input.selectedOption});
                poll.options[input.selectedOption].voteCount++
            }
        },
    },
    extraReducers: (builders) => {
        // builder.addCase(addPollAsync.fulfilled, (state) => {
        // })
    }
})

export const {addPoll, addOption, voteOption} = pollSlice.actions;
export default pollSlice.reducer;

