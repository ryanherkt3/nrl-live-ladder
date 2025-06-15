import { configureStore } from '@reduxjs/toolkit';
import currentCompReducer from './current-comp/currentComp';
import currentYearReducer from './current-year/currentYear';
import mainSiteColourReducer from './main-site-colour/mainSiteColour';
import clearRoundButtonReducer from './clear-round-button/clearRoundButton';
import resetAllButtonReducer from './reset-all-button/resetAllButton';

export const store = configureStore({
    reducer: {
        currentComp: currentCompReducer,
        currentYear: currentYearReducer,
        mainSiteColour: mainSiteColourReducer,
        clearRoundButton: clearRoundButtonReducer,
        resetAllButton: resetAllButtonReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
