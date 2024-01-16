import {combineReducers, configureStore} from "@reduxjs/toolkit";
import PlanetReducer from "./reducers/PlanetSlice.ts"
import FlightReducer from "./reducers/FlightSlice.ts"
import userReducer from "./reducers/UserSlice.ts"
import progressReducer from "./reducers/ProgressData.ts";

const rootReducer = combineReducers({
    PlanetReducer,
    FlightReducer,
    userReducer,
    progressReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']