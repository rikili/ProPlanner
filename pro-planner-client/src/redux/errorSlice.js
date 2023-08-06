import { createSlice } from '@reduxjs/toolkit';
import { updateOutings } from './outingSlice';
import { ERR_TYPE } from '../constants';
import { setUserSelectionsAsync } from './tripSlice';
import { setPlanDecision } from './planParamSlice';
import { getUserAsync } from './userSlice';

// Custom Errors
const selectionUpdateFailure = (state) => {
    const errMsg = 'Updating of selections have partially or completely failed.';
    buildError(state, ERR_TYPE.WARN, errMsg, false, false);
};

const decisionUpdateFailure = (state) => {
    const errMsg = 'Setting of decision has failed.';
    buildError(state, ERR_TYPE.WARN, errMsg);
}

const invalidPlanError = (state) => {
    const errMsg = 'Information of this plan is invalid, malformed, or missing. Close this notification to be redirected to the landing page, or you will be redirected shortly.';
    buildError(state, ERR_TYPE.ERR, errMsg, '/', true);
}

const userGetFailure = (state) => {
    const errMsg = 'Retrieval of user information has failed. Close this notification to be redirected to the landing page, or you will be redirected shortly.';
    buildError(state, ERR_TYPE.ERR, errMsg, '/', true);
}

// State update helper
const buildError = (state, errType, errMsg, redir=null, disable=false) => {
    state.isShowError = true;
    state.errorType = errType;
    state.errorMessage = errMsg;
    state.redirect = redir;
    state.disableControl = disable;
};

const errorSlice = createSlice({
    name: 'error',
    initialState: {
        isShowError: false,
        disableControl: false,
        errorType: null,
        redirect: null,
        errorMessage: '',
    },
    reducers: {
        /* 
            Takes in payload of format
            {
                errType = ERR_TYPE       // type of error
                message = string        // message of error
                redirect = string       // route to redirect on close
                disableControl? = bool  // dictates if error should block user action
            }
        */
        setError(state, action) {
            const {errType, message, redirect, disableControl} = action.payload;
            if (!errType && !message) {
                return;
            }
            buildError(state, errType, message, redirect, disableControl);
        },
        
        resetError(state) {
            state.isShowError = false;
            state.disableControl = false;
            state.errorType = null;
            state.errorMessage = '';
            state.redirect = null;
        },

        setInvalidPlanError(state) {
            invalidPlanError(state);
        }
    },
    // Custom error cases
    extraReducers: (builder) => {
        builder.addCase(updateOutings.rejected, (state) => {
            selectionUpdateFailure(state);
        });

        builder.addCase(setUserSelectionsAsync.rejected, (state) => {
            selectionUpdateFailure(state);
        });

        builder.addCase(setPlanDecision.rejected, (state) => {
            decisionUpdateFailure(state);
        });
        builder.addCase(getUserAsync.rejected, (state, { statusCode }) => {
            if (statusCode === 404) {
                invalidPlanError(state);
            } else {
                userGetFailure(state);
            }
        });
    },
});

export const { setError, resetError, setInvalidPlanError } = errorSlice.actions;
export default errorSlice.reducer;
