import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DrawInfo } from '../../lib/definitions';

interface DrawState {
    data: DrawInfo[];
    fetched: boolean;
    error: boolean;
}

const initialState: DrawState = {
    data: [],
    fetched: false,
    error: false,
};

const drawSlice = createSlice({
    name: 'drawData',
    initialState,
    reducers: {
        setDrawData(state, action: PayloadAction<DrawInfo[]>) {
            state.data = action.payload;
            state.fetched = true;
            state.error = false;
        },
        setDrawError(state) {
            state.error = true;
            state.fetched = false;
        },
        resetDraw(state) {
            state.data = [];
            state.fetched = false;
            state.error = false;
        },
    },
});

export const { setDrawData, setDrawError, resetDraw } = drawSlice.actions;
export default drawSlice.reducer;
