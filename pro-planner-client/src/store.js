import { combineReducers, configureStore } from '@reduxjs/toolkit';

import planParamSlice from './redux/planParamSlice';
import userSlice from './redux/userSlice';
import pollSlice from './redux/pollSlice';
import costSlice from './redux/costSlice';
import errorSlice from './redux/errorSlice';
import outingSlice from './redux/outingSlice';
import tripSlice from './redux/tripSlice';
import summarySlice from './redux/summarySlice';

export default configureStore({
    reducer: combineReducers({
        planParameters: planParamSlice,
        user: userSlice,
        error: errorSlice,
        poll: pollSlice,
        outing: outingSlice,
        tripSelections: tripSlice,
        summary: summarySlice,
        cost: costSlice,
    }),
});
