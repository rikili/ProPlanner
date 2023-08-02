import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buildServerRoute } from '../helpers/Utils';
import { PLAN_TYPE, LOAD_STATUS } from '../constants';

export const setupParams = createAsyncThunk('parameters/get', async (tripId) => {
    const response = await axios.get(buildServerRoute('plan',tripId));
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
        description: '',
        location: null,
        budget: null,
        
        decisionRange: [],

        isUploading: false,
        paramStatus: null,
        isInitialized: false,
        isEditing: false,
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
            state.description = payload.description;
            state.budget = payload.budget;
            state.dateTimeRange = payload.dateTimeRange;
            state.planType = payload.planType;
            state.isInitialized = true;
        },

        setDecisionRange(state, { payload }) {
            state.decisionRange = payload;
        },

        setIsUploading(state, { payload }) {
            state.isUploading = payload;
        },

        setIsEditing(state, { payload }) {
            state.isEditing = payload;
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
            const {name, planType, dateTimeRange, dayOffset, budget, description, isAllDay, location} = action.payload;
            state.name = name;
            state.planType = planType;
            state.dateTimeRange = dateTimeRange;
            state.dayOffset = dayOffset;
            budget && (state.budget = budget);
            description && (state.description = description);
            state.isAllDay = isAllDay;
            state.location = location;
            state.paramStatus = LOAD_STATUS.SUCCESS;
            state.isInitialized = true;
        });
    }
});

export const { changePlanType, updatePlan, setDecisionRange, setIsUploading, setIsEditing } = planParamSlice.actions;
export default planParamSlice.reducer;
