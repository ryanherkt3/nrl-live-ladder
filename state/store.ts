import { configureStore } from '@reduxjs/toolkit';
import mainSiteColourReducer from './main-site-colour/mainSiteColour';
import clearRoundButtonReducer from './clear-round-button/clearRoundButton';
import resetAllButtonReducer from './reset-all-button/resetAllButton';
import drawDataReducer from './draw/drawData';

export const store = configureStore({
    reducer: {
        mainSiteColour: mainSiteColourReducer,
        clearRoundButton: clearRoundButtonReducer,
        resetAllButton: resetAllButtonReducer,
        drawData: drawDataReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
