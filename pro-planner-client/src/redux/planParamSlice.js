import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buildServerRoute } from '../helpers/Utils';
import { PLAN_TYPE, LOAD_STATUS } from '../constants';

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
        
        decisionRange: [],

        paramStatus: null,
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
        },

        setDecisionRange(state, { payload }) {
            state.decisionRange = payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setupParams.pending, (state) => {
            state.paramStatus = LOAD_STATUS.LOADING;
        });
        builder.addCase(setupParams.rejected, (state) => {
            state.paramStatus = LOAD_STATUS.FAILED;
        });
        builder.addCase(setupParams.fulfilled, (state, action) =>  {
            const params = action.payload;
            state.name = params.name;
            state.planType = params.planType;
            state.dateTimeRange = params.dateTimeRange;
            state.dayOffset = params.dayOffset;
            state.isAllDay = params.isAllDay;
            state.location = params.location;
            state.paramStatus = LOAD_STATUS.SUCCESS;
            state.isInitialized = true;
        });
    }
});

export const { changePlanType, updatePlan, setDecisionRange } = planParamSlice.actions;
export default planParamSlice.reducer;
