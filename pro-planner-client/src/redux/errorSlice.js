import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
    name: 'error',
    initialState: {
        isShowError: false,
        disableControl: false,
        errorType: null,
        errorMessage: '',
    },
    reducers: {
        /* 
            Takes in payload of format
            {
                errType = ERR_TYPE         // type of error
                message = string       // message of error
                disableControl? = bool   // dictates if error should block user action
            }
        */
        setError(state, action) {
            if (!action.type && !action.message && !action.redirect) {
                return;
            }
            state.isShowError = true;
            state.errorType = action.payload.errType;
            state.errorMessage = action.payload.message;
            state.disableControl = !!action.payload.disableControl;
        },
        /* 

        */
        resetError(state, action) {
            state.isShowError = false;
            state.disableControl = false;
            state.errorType = null;
            state.errorMessage = '';
        }
    }
});

export const { setError, resetError } = errorSlice.actions;
export default errorSlice.reducer;
