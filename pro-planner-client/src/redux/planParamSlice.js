import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buildServerRoute } from '../helpers/Utils';
import { PLAN_TYPE } from '../constants';

export const setupParams = createAsyncThunk('parameters/get', async (tripId) => {
    const response = await axios.get(buildServerRoute('trip',tripId));
    return response.data;
});

const planParamSlice = createSlice({
    name: 'parameters',
    initialState: {
        name: null,
        planType: PLAN_TYPE.OUTING,
        dateTimeRange: [],
        dayOffset: [],
        isAllDay: false,
        location: null,
        budget: null,
        isInitialized: false,
    },
    reducers: {
        // payload should be a string of either 'Trip' or 'Outing'
        changePlanType(state, action) {
            switch(action.payload) {
                case PLAN_TYPE.TRIP:
                    state.planType = action.payload;
                    break;
                case PLAN_TYPE.OUTING:
                    state.planType = action.payload;
                    break;
                default:
                    console.error('Invalid plan type provided to state.'); // TODO: implement an error/alert system to users
            }
        },

        // payload contains complete set of values to update -- should be complete even if values don't change
        updatePlan(state, { payload }) {
            state.name = payload.name;
            state.dayOffset = payload.dayOffset;
            state.isAllDay = payload.isAllDay;
            state.location = payload.location;
            state.budget = payload.budget;
            state.dateTimeRange = payload.dateTimeRange;
            state.planType = payload.planType;
            state.isInitialized = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setupParams.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(setupParams.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(setupParams.fulfilled, (state, action) =>  {
            const params = action.payload;
            state.name = params.name;
            state.planType = params.planType;
            state.dateTimeRange = params.dateTimeRange;
            state.dayOffset = params.dayOffset;
            state.isAllDay = params.isAllDay;
            state.location = params.location;
            state.isInitialized = true;
        });
    }
});

export const { changePlanType, updatePlan } = planParamSlice.actions;
export default planParamSlice.reducer;
