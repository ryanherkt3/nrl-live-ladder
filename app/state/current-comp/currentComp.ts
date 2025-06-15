import { COMPID } from '@/app/lib/utils';
import { createSlice } from '@reduxjs/toolkit';

interface CurrentCompState {
    value: string;
}

const initialState: CurrentCompState = {
    value: '',
};

const CurrentCompSlice = createSlice({
    name: 'CurrentComp',
    initialState,
    reducers: {
        update: (state, action) => {
            state.value = Object.keys(COMPID).includes(action.payload.toUpperCase()) ? action.payload : 'nrl';
        }
    }
});

export const { update } = CurrentCompSlice.actions;

export default CurrentCompSlice.reducer;
