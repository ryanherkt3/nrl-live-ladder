import { createSlice } from '@reduxjs/toolkit';

interface ResetAllButtonState {
    value: boolean;
}

const initialState: ResetAllButtonState = {
    value: true, // is disabled
};

const ResetAllButtonSlice = createSlice({
    name: 'ResetAllButton',
    initialState,
    reducers: {
        update: (state, action : { payload: boolean }) => {
            state.value = action.payload;
        }
    }
});

export const { update } = ResetAllButtonSlice.actions;

export default ResetAllButtonSlice.reducer;
