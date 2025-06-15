import { createSlice } from '@reduxjs/toolkit';

interface ResetAllButtonState {
    value: boolean;
}

const initialState: ResetAllButtonState = {
    value: false,
};

const ResetAllButtonSlice = createSlice({
    name: 'ResetAllButton',
    initialState,
    reducers: {
        update: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { update } = ResetAllButtonSlice.actions;

export default ResetAllButtonSlice.reducer;
