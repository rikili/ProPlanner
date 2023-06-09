import { combineReducers, configureStore } from "@reduxjs/toolkit";

import planParamSlice from "./redux/planParamSlice";
import userReducer from './redux/userSlice';

export default configureStore({
    reducer: combineReducers({
        planParameters: planParamSlice,
        user: userReducer
    }),
});
