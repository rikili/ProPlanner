import { createSlice } from '@reduxjs/toolkit';
import { PLAN_TYPE } from '../constants';

const planParamSlice = createSlice({
    name: 'parameters',
    initialState: {
        name: null,
        planType: PLAN_TYPE.OUTING,
        availableDays: [],
        dateTimeRange: [],
        dayOffset: [],
        isAllDay: false,
        location: null,
        budget: 1000
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
        updatePlan(state, action) {
            const input = action.payload;
            state.name = input.name;
            state.dayOffset = input.dayOffset;
            state.isAllDay = input.isAllDay;
            state.location = input.location;
            state.dateTimeRange = input.dateTimeRange;
        }
    },
});

export const { changePlanType, updatePlan } = planParamSlice.actions;
export default planParamSlice.reducer;
