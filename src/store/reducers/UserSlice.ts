import {IUser} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserState {
    user: IUser | null
    isLoading: boolean
    error: string
    success: string
    isAuth: boolean
}

const initialState: UserState = {
    user: null,
    isLoading: false,
    isAuth: false,
    error: '',
    success: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        startProcess(state) {
            state.isLoading = true

        },
        setAuthStatus(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload
        },
        setStatuses(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        setError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.success = ''
        },
        resetStatuses(state) {
            state.isLoading = false
            state.error = ''
            state.success = ''
        },
    },
})

export default userSlice.reducer;