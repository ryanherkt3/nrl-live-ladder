import { createSlice } from '@reduxjs/toolkit';

interface CurrentYearState {
    value: number;
}

const initialState: CurrentYearState = {
    value: 0,
};

const CurrentYearSlice = createSlice({
    name: 'CurrentYear',
    initialState,
    reducers: {
        update: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { update } = CurrentYearSlice.actions;

export default CurrentYearSlice.reducer;
