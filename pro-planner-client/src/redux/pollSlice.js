import axios from 'axios';
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {LOAD_STATUS} from '../constants';


// TODO: remove hardcoded server URL with .env
export const getPollAsync = createAsyncThunk(
    'poll/get',
    async ({tripId}) => {
        const response = await axios.get(`http://localhost:5001/poll/${tripId}`);
        return response.data;
    });

export const addPollAsync = createAsyncThunk(
    'poll/add',
    async ({newQuestion, pollDocumentId}) => {
        const response = await axios.put(
            `http://localhost:5001/poll/${pollDocumentId}`,
            {
                question: newQuestion
            });
        return response.data;
    });

export const addOptionAsync = createAsyncThunk(
    'poll/option/add',
    async ({newOption, pollDocumentId, pollId}) => {
        const response = await axios.put(
            `http://localhost:5001/poll/option/${pollDocumentId}/${pollId}`,
            {
                option: newOption
            });
        return response.data
    });

export const voteOptionAsync = createAsyncThunk(
    'poll/option/vote',
    async ({currUser, votedOptionId, newVotedOptionId, pollDocumentId, pollId}) => {
        const response = await axios.patch(
            `http://localhost:5001/poll/vote/${pollDocumentId}/${pollId}`,
            {
                user: currUser,
                votedOptionId: votedOptionId,
                newVotedOptionId: newVotedOptionId
            });
        return response.data;
    });


const pollSlice = createSlice({
    name: 'poll',
    initialState: {
        pollsId: null, // poll document Id
        polls: {},
        pollStatus: null,
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
    extraReducers: (builder) => {
        builder.addCase(getPollAsync.pending, (state) => {
            state.pollStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(getPollAsync.fulfilled, (state, action) => {
            state.polls = action.payload.polls;
            state.pollsId = action.payload._id;
            state.pollStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(getPollAsync.rejected, (state) => {
            state.pollStatus = LOAD_STATUS.FAILED;
        });

        builder.addCase(addPollAsync.pending, (state) => {
            state.pollStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(addPollAsync.fulfilled, (state, action) => {
            state.polls = action.payload.polls;
            console.log(state.polls)
            state.pollsId = action.payload._id;
            state.pollStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(addPollAsync.rejected, (state) => {
            state.pollStatus = LOAD_STATUS.FAILED;
        });

        builder.addCase(addOptionAsync.pending, (state) => {
            state.pollStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(addOptionAsync.fulfilled, (state, action) => {
            state.polls = action.payload.polls;
            state.pollStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(addOptionAsync.rejected, (state) => {
            state.pollStatus = LOAD_STATUS.FAILED;
        });

        builder.addCase(voteOptionAsync.pending, (state) => {
            state.pollStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(voteOptionAsync.fulfilled, (state, action) => {
            state.polls = action.payload.polls;
            state.pollStatus = LOAD_STATUS.SUCCESS;
        });
        builder.addCase(voteOptionAsync.rejected, (state) => {
            state.pollStatus = LOAD_STATUS.FAILED;
        });
    }
})

export const {addPoll, addOption, voteOption} = pollSlice.actions;
export default pollSlice.reducer;

