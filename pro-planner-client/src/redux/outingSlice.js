import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { buildServerRoute } from '../helpers/Utils';

export const updateOutings = createAsyncThunk(
    'outing/update',
    async ({ user, planId, selections, months }, { rejectWithValue }) => {
        const promises = months.map((monthIndex) =>
            axios.put(buildServerRoute('outing', planId), {
                userId: user,
                selections: {
                    [monthIndex]: selections[monthIndex],
                },
            })
        );
        let reject = false;
        const result = (await Promise.allSettled(promises)).map((res) => {
            if (!res.reason) return res.value.data.month;
            reject = true;
            return null;
        });
        const payload = {
            result,
            months,
            user,
        };
        return reject ? rejectWithValue(payload) : payload;
    }
);

const outingSlice = createSlice({
    name: 'outing',
    initialState: {
        isLoading: false,
        selections: {},
    },
    reducers: {
        setUserSelections(state, action) {
            const { user, selections } = action.payload;

            if (!state.selections[user]) state.selections[user] = {};
            Object.entries(selections).forEach(([monthIndex, selections]) => {
                state.selections[user][monthIndex] = selections;
            });
        },
        setLoading(state, { payload }) {
            state.isLoading = payload;
        },
        resetUpdateFailed(state) {
            state.updateFailed = false;
        },
        clearOutingSelections(state) {
            state.selections = {};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateOutings.fulfilled, (state, { payload }) => {
            const { result, months, user } = payload;

            months.forEach((monthIndex, index) => {
                const userSelections = state.selections[user];
                const monthResult = result[index];
                userSelections[monthIndex] = monthResult;
            });
        });
        builder.addCase(updateOutings.rejected, (state, { payload }) => {
            const { result, months, user } = payload;

            months.forEach((monthIndex, index) => {
                const userSelections = state.selections[user];
                const monthResult = result[index];
                if (!monthResult) return;
                userSelections[monthIndex] = monthResult;
            });
        });
    },
});

export const { setUserSelections, setLoading, resetUpdateFailed, clearOutingSelections } =
    outingSlice.actions;
export default outingSlice.reducer;
