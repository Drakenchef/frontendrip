import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ProgressState {
    searchValue: string
    datestart: Date
    dateend: Date
}

const initialState: ProgressState = {
    searchValue: '',
    datestart: new Date('2024-01-01'),
    dateend: new Date('2024-01-30'),
}

export const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.searchValue = action.payload
        },
        resetSearch(state) {
            state.searchValue = ''
        },
        setStartDate(state, action: PayloadAction<string>) {
            state.datestart = action.payload
        },
        resetStartDate(state) {
            state.datestart = ''
        },
        setEndDate(state, action: PayloadAction<string>) {
            state.dateend = action.payload
        },
        resetEndDate(state) {
            state.dateend = ''
        },
    },
})

export default progressSlice.reducer;