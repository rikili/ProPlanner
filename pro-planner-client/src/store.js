import {combineReducers, configureStore} from "@reduxjs/toolkit";

import planParamSlice from "./redux/planParamSlice";
import userSlice from './redux/userSlice';
import pollSlice from "./redux/pollSlice";
import costSlice from "./redux/costSlice";
import errorSlice from './redux/errorSlice';
import calendarSlice from './redux/calendarSlice';

export default configureStore({
    reducer: combineReducers({
        planParameters: planParamSlice,
        user: userSlice,
        error: errorSlice,
        poll: pollSlice,
        cost: costSlice,
        outingSelections: calendarSlice
    }),
});
