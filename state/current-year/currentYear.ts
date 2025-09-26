import { CurrentYear, ReduxUpdateFlags } from '@/lib/definitions';
import { createSlice } from '@reduxjs/toolkit';

interface CurrentYearState {
    value: CurrentYear;
}

const initialState: CurrentYearState = {
    value: {
        year: new Date().getFullYear(),
        updateStatus: ReduxUpdateFlags.NotUpdated
    },
};

const CurrentYearSlice = createSlice({
    name: 'CurrentYear',
    initialState,
    reducers: {
        update: (state, action) => {
            state.value = { year: action.payload, updateStatus: ReduxUpdateFlags.FinalUpdate };
        }
    }
});

export const { update } = CurrentYearSlice.actions;

export default CurrentYearSlice.reducer;
