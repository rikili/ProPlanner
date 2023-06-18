import {combineReducers, configureStore} from "@reduxjs/toolkit";

import planParamSlice from "./redux/planParamSlice";
import userSlice from './redux/userSlice';
import pollSlice from "./redux/pollSlice";
import errorSlice from './redux/errorSlice';

export default configureStore({
    reducer: combineReducers({
        planParameters: planParamSlice,
        user: userSlice,
        error: errorSlice,
        poll: pollSlice
    }),
});
