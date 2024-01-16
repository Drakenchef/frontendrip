import {IPlanet} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface PlanetState {
    Planets: IPlanet[];
    Planet: IPlanet | null,
    isLoading: boolean;
    error: string;
    success: string;
    serialNumber: number;
    basketID: number;
}

const initialState: PlanetState = {
    Planets: [],
    Planet: null,
    isLoading: false,
    error: '',
    success: '',
    serialNumber: 1,
    basketID: 0
}

export const PlanetSlice = createSlice({
    name: 'Planet',
    initialState,
    reducers: {
        increase(state) {
            state.serialNumber += 1
        },
        minus(state) {
            state.serialNumber = state.serialNumber == 1 ? 1 :  state.serialNumber - 1
        },
        reset(state) {
            state.serialNumber = 1
        },
        PlanetsFetching(state) {
            state.isLoading = true
            state.error = ''
            state.success = ''
        },
        PlanetsFetched(state, action: PayloadAction<[IPlanet[], number]>) {
            state.isLoading = false
            state.Planets = action.payload[0]
            state.basketID = action.payload[1]
        },
        PlanetsFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.success = ''
        },
        setBasket(state, action: PayloadAction<number>) {
            state.basketID = action.payload
        },
        PlanetAddedIntoFlight(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        PlanetFetching(state) {
            state.isLoading = true
            state.error = ''
            state.success = ''
        },
        PlanetFetched(state, action: PayloadAction<IPlanet>) {
            state.isLoading = false
            state.error = ''
            state.Planet = action.payload
        },
        PlanetFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.Planets = []
            state.Planet = null
        },
    },
})



export default PlanetSlice.reducer;