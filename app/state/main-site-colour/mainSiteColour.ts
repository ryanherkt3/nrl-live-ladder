import { MainSiteColour } from '@/app/lib/definitions';
import { COMPID } from '@/app/lib/utils';
import { createSlice } from '@reduxjs/toolkit';

interface MainSiteColourState {
    value: MainSiteColour;
}

const initialState: MainSiteColourState = {
    value: {
        colour: '',
        finalUpdate: false
    },
};

const MainSiteColourSlice = createSlice({
    name: 'MainSiteColour',
    initialState,
    reducers: {
        update: (state, action) => {
            let mainSiteColour = '';

            const { comp, currentRoundNo, finalUpdate } = action.payload;

            if (!comp || !currentRoundNo) {
                state.value = { colour: 'nrl', finalUpdate: finalUpdate };
                return;
            }

            const { NSW, NRLW, NRL, QLD } = COMPID;

            if (comp === NRLW) {
                const NRLWROUNDID : { [key: number]: string } = Object.freeze({
                    6: 'ind',
                    7: 'ind',
                    8: 'ctry'
                });

                mainSiteColour = 'nrlw';
                if (NRLWROUNDID[currentRoundNo]) {
                    mainSiteColour += `-${NRLWROUNDID[currentRoundNo]}`;
                }
            }
            else if (comp === NRL) {
                const NRLROUNDID : { [key: number]: string } = Object.freeze({
                    5: 'mclt',
                    9: 'magic',
                    10: 'wil',
                    17: 'bean',
                    23: 'ind',
                    24: 'ind',
                    25: 'ctry'
                });

                mainSiteColour = 'nrl';
                if (NRLROUNDID[currentRoundNo]) {
                    mainSiteColour += `-${NRLROUNDID[currentRoundNo]}`;
                }
            }
            else if (comp === NSW || comp === QLD) {
                mainSiteColour = comp === NSW ? 'nsw' : 'qld';
            }
            else {
                mainSiteColour = 'nrl';
            }

            state.value = { colour: mainSiteColour, finalUpdate: finalUpdate };
        }
    }
});

export const { update } = MainSiteColourSlice.actions;

export default MainSiteColourSlice.reducer;
