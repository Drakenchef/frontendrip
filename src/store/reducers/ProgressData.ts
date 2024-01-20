import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ProgressState {
    searchValue: string
    datestart: Date
    dateend: Date
    user:string
}

const initialState: ProgressState = {
    searchValue: '',
    datestart: new Date('2024-01-01'),
    dateend: new Date('2024-01-30'),
    user:'',
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
        setStartDate(state, action: PayloadAction<Date>) {
            state.datestart = action.payload
        },
        resetStartDate(state) {
            state.datestart = ''
        },
        setEndDate(state, action: PayloadAction<Date>) {
            state.dateend = action.payload
        },
        resetEndDate(state) {
            state.dateend = ''
        },
        setUserName(state, action: PayloadAction<string>) {
            state.user = action.payload
        },
        resetUserName(state) {
            state.user = ''
        },

    },
})

export default progressSlice.reducer;