import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buildServerRoute } from '../helpers/Utils';
import { PLAN_TYPE } from '../constants';

export const setPlanDecision = createAsyncThunk(
    'parameter/update/decision',
    async ({ planId, planType, range }) => {
        const response = await axios.put(buildServerRoute(planType, 'decision', planId), {
            decision: range,
        });
        return response.data;
    }
);

const planParamSlice = createSlice({
    name: 'parameters',
    initialState: {
        name: null,
        planType: null,
        dateTimeRange: [],
        dayOffset: [],
        isAllDay: false,
        description: '',
        location: null,
        budget: null,

        decisionRange: [],

        isUploading: false,
        isInitialized: false,
        isEditing: false,

        codeReadyToCopy: false,
    },
    reducers: {
        // payload should be a string of either 'Trip' or 'Outing'
        changePlanType(state, action) {
            switch (action.payload) {
                case PLAN_TYPE.TRIP:
                    state.planType = action.payload;
                    break;
                case PLAN_TYPE.OUTING:
                    state.planType = action.payload;
                    break;
                default:
                    console.error('Invalid plan type provided to state.');
            }
        },

        // payload contains complete set of values to update -- should be complete even if values don't change
        updatePlan(state, { payload }) {
            state.name = payload.name;
            state.dayOffset = payload.dayOffset;
            state.isAllDay = payload.isAllDay;
            state.location = payload.location;
            state.description = payload.description;
            state.budget = payload.budget;
            state.dateTimeRange = payload.dateTimeRange;
            state.planType = payload.planType;
            state.decisionRange = payload.decision ?? [];
            state.isInitialized = true;
        },

        setIsUploading(state, { payload }) {
            state.isUploading = payload;
        },

        setIsEditing(state, { payload }) {
            state.isEditing = payload;
        },

        setCodeReadyToCopy(state, { payload }) {
            state.codeReadyToCopy = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setPlanDecision.fulfilled, (state, { payload }) => {
            state.decisionRange = payload.decision;
        });
    },
});

export const { changePlanType, updatePlan, setIsUploading, setIsEditing, setCodeReadyToCopy } =
    planParamSlice.actions;
export default planParamSlice.reducer;
