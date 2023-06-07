import { createSlice } from '@reduxjs/toolkit';

export const PLAN_TYPE = {
    OUTING: 'outing',
    TRIP: 'trip',
}

const isValidOutingFormat = (dateTime) => {
    return (dateTime 
        && dateTime[0]
        && dateTime[1]
        && dateTime[0][0]
        && dateTime[0][1]
    );
}

export const planParamSlice = createSlice({
    name: 'parameters',
    initialState: {
        name: null,
        planType: PLAN_TYPE.TRIP,
        availableDays: [],
        dateTimeRange: [],
        isAllDay: false,
        location: null
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
            if (!(input.name
                && input.availableDays.length 
                && input.dateTimeRange.length 
                && (input.isAllDay || isValidOutingFormat(input.dateTimeRange)) 
                && input.location)) {
                    console.error("Incomplete payload sent to state for updating plan.");
                    return;
                }
            state.name = input.name;
            state.availableDays = input.availableDays;
            state.isAllDay = input.isAllDay;
            state.location = input.location;
            state.dateTimeRange = input.dateTimeRange;
        }
    },
});

export const { changePlanType, updatePlan } = planParamSlice.actions;
export default planParamSlice.reducer;
