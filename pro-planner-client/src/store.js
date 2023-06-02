import { combineReducers, configureStore } from "@reduxjs/toolkit";

import planParamSlice from "./redux/planParamSlice";

export default configureStore({
    reducer: combineReducers({
        planParameters: planParamSlice,
    }),
});
