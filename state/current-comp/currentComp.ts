import { CurrentComp, ReduxUpdateFlags } from '@/lib/definitions';
import { COMPID } from '@/lib/utils';
import { createSlice } from '@reduxjs/toolkit';

interface CurrentCompState {
    value: CurrentComp;
}

const initialState: CurrentCompState = {
    value: {
        comp: 'nrl',
        updateStatus: ReduxUpdateFlags.NotUpdated
    },
};

const CurrentCompSlice = createSlice({
    name: 'CurrentComp',
    initialState,
    reducers: {
        update: (state, action) => {
            const comp = Object.keys(COMPID).includes(action.payload.toUpperCase()) ? action.payload : 'nrl';

            state.value = { comp: comp, updateStatus: ReduxUpdateFlags.FinalUpdate };
        }
    }
});

export const { update } = CurrentCompSlice.actions;

export default CurrentCompSlice.reducer;
