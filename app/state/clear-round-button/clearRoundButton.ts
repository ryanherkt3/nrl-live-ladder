import { createSlice } from '@reduxjs/toolkit';

interface ClearRoundButtonState {
    value: boolean;
}

const initialState: ClearRoundButtonState = {
    value: true, // is disabled
};

const ClearRoundButtonSlice = createSlice({
    name: 'ClearRoundButton',
    initialState,
    reducers: {
        update: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { update } = ClearRoundButtonSlice.actions;

export default ClearRoundButtonSlice.reducer;
