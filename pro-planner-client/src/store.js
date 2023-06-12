import { combineReducers, configureStore } from "@reduxjs/toolkit";

import planParamSlice from "./redux/planParamSlice";
import userReducer from './redux/userSlice';
import calendarSlice from './redux/calendarSlice';

export default configureStore({
    reducer: combineReducers({
        planParameters: planParamSlice,
        calendar: calendarSlice, 
        user: userReducer
    }),
});
