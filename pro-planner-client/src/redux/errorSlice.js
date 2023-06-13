import { createSlice } from '@reduxjs/toolkit';

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
            const payload = action.payload;
            if (!payload.type && !payload.message) {
                return;
            }
            state.isShowError = true;
            state.errorType = payload.errType;
            state.errorMessage = payload.message;
            state.redirect = payload.redirect;
            state.disableControl = !!payload.disableControl;
        },
        /* 

        */
        resetError(state) {
            state.isShowError = false;
            state.disableControl = false;
            state.errorType = null;
            state.errorMessage = '';
        }
    }
});

export const { setError, resetError } = errorSlice.actions;
export default errorSlice.reducer;
