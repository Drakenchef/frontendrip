import {IDeletePlanetRequest, IFlight, IRequest} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface FlightState {
    Flight: IRequest | null;
    singleFlight: IFlight | null,
    isLoading: boolean;
    error: string;
    success: string;
}

const initialState: FlightState = {
    Flight: null,
    singleFlight: null,
    isLoading: false,
    error: '',
    success: ''
}

export const FlightSlice = createSlice({
    name: 'Flight',
    initialState,
    reducers: {
        FlightsFetching(state) {
            state.isLoading = true
        },
        FlightsFetched(state, action: PayloadAction<IRequest>) {
            state.isLoading = false
            state.error = ''
            state.Flight = action.payload
        },
        FlightFetched(state, action: PayloadAction<IFlight>) {
            state.isLoading = false
            state.error = ''
            state.singleFlight = action.payload
        },
        FlightsDeleteSuccess(state, action: PayloadAction<IDeletePlanetRequest>) {
            state.isLoading = false
            const text = action.payload.description ?? ""
            state.error = text
            state.success = "Планета успешно удалена из заявки"
        },
        FlightsUpdated(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        FlightsDeleteError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
        FlightsFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
    },
})

export default FlightSlice.reducer;