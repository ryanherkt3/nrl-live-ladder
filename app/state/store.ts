import { configureStore } from '@reduxjs/toolkit';
import currentCompReducer from './current-comp/currentComp';
import currentYearReducer from './current-year/currentYear';
import mainSiteColourReducer from './main-site-colour/mainSiteColour';

export const store = configureStore({
    reducer: {
        currentComp: currentCompReducer,
        currentYear: currentYearReducer,
        mainSiteColour: mainSiteColourReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
