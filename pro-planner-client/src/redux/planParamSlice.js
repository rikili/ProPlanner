import { createSlice } from '@reduxjs/toolkit';

export const planParamSlice = createSlice({
    name: 'parameters',
    initialState: {
        name: null,
        planType: 'Trip',
        availableDays: [],
        dateRange: [],
        isAllDay: false,
        timeRange: [],
        location: null
    },
    reducers: {
        // payload should be a string of either 'Trip' or 'Outing'
        changePlanType(state, action) {
            switch(action.payload) {
                case 'Trip':
                    state.planType = action.payload;
                    break;
                case 'Outing':
                    state.planType = action.payload;
                    break;
                default:
                    console.error('Invalid plan type provided to state.'); // TODO: implement an error/alert system to users
            }
        },

        // payload contains complete set of values to update -- should be complete even if values don't change
        updatePlan(state, action) {
            const input = action.payload;
            if (!(input.name
                && input.availableDays.length 
                && input.dateRange.length 
                && (input.isAllDay || (input.dateRange?.length && input.dateRange[0] && input.dateRange[1])) 
                && input.location)) {
                    console.error("Incomplete payload sent to state for updating plan.");
                    return;
                }
            state.name = input.name;
            state.availableDays = input.availableDays;
            state.isAllDay = input.isAllDay;
            state.location = input.location;
            state.dateRange = input.dateRange;
            state.timeRange = state.planType === "Outing" ? input.timeRange : state.timeRange;
        }
    },
});

export const { changePlanType, updatePlan } = planParamSlice.actions;
export default planParamSlice.reducer;
