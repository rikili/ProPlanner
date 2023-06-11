import { combineReducers, configureStore } from "@reduxjs/toolkit";

import planParamSlice from "./redux/planParamSlice";
import userSlice from './redux/userSlice';

export default configureStore({
    reducer: combineReducers({
        planParameters: planParamSlice,
        user: userSlice
    }),
});
