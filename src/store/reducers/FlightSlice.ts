import {IDeletePlanetRequest, IFlight} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface Flightstate {
    Flights: IFlight[];
    Flight: IFlight | null;
    isLoading: boolean;
    error: string;
    success: string;
}



const initialState: Flightstate = {
    Flights: [],
    Flight: null,
    isLoading: false,
    error: '',
    success: ''
}

export const flightSlice = createSlice({
    name: 'Flight',
    initialState,
    reducers: {
        FlightsFetching(state) {
            state.isLoading = true
        },
        FlightsFetched(state, action: PayloadAction<IFlight[]>) {
            state.isLoading = false
            state.error = ''
            state.Flights = action.payload

        },
        FlightFetched(state, action: PayloadAction<IFlight>) {
            state.isLoading = false
            state.error = ''
            state.Flight = action.payload

        },
        FlightsDeleteSuccess(state, action: PayloadAction<IDeletePlanetRequest>) {
            state.isLoading = false
            const text = action.payload.description ?? ""
            state.error = text
            state.success = "Планета успешно удалён из заявки"
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

export default flightSlice.reducer;