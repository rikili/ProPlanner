import { createSlice } from '@reduxjs/toolkit';
import { updateOutings } from './outingSlice';
import { ERR_TYPE } from '../constants';
import { setUserSelectionsAsync } from './tripSlice';

// Custom Errors
const selectionUpdateFailure = (state) => {
    const errMsg = 'Updating of selections have partially or completely failed.';
    buildError(state, ERR_TYPE.WARN, errMsg, false, false);
};


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
        /* 

        */
        resetError(state) {
            state.isShowError = false;
            state.disableControl = false;
            state.errorType = null;
            state.errorMessage = '';
            state.redirect = null;
        }
    },
    extraReducers: (builder) => {
        // Custom error cases
        builder.addCase(updateOutings.rejected, (state) => {
            selectionUpdateFailure(state);
        });

        builder.addCase(setUserSelectionsAsync.rejected, (state) => {
            selectionUpdateFailure(state)
        });
    },
});

export const { setError, resetError } = errorSlice.actions;
export default errorSlice.reducer;
