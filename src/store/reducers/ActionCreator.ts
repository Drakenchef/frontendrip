import {AppDispatch} from "../store.ts";
import axios from "axios";
import {
    IAuthResponse,
    IPlanetResponse,
    IPlanetWithBasket,
    IDeletePlanetRequest,
    IFlightResponse, IRegisterResponse,
    IRequest,
    mockPlanets, IFlight, IPlanet
} from "../../models/models.ts";
import Cookies from 'js-cookie';
import {PlanetSlice} from "./PlanetSlice.ts"
import {flightSlice} from "./FlightSlice.ts";
import {userSlice} from "./UserSlice.ts";


export const fetchPlanets = (searchValue?: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    const config = {
        method: "get",
        url: `/api/Planets`+ `?search=${searchValue ?? ''}`,
        headers: {
            Authorization: `Bearer ${accessToken ?? ''}`,
        },
    }
    try {
        dispatch(PlanetSlice.actions.PlanetsFetching())
        const response = await axios<IPlanetWithBasket>(config);
        dispatch(PlanetSlice.actions.PlanetsFetched([response.data.Planets,response.data.Flight_id]))
    } catch (e) {
        dispatch(PlanetSlice.actions.PlanetsFetchedError(`Ошибка: ${e}`))
        dispatch(PlanetSlice.actions.PlanetsFetched(filterMockData(searchValue)))
    }
}

export const addPlanetIntoFlight = (PlanetId: number, serialNumber: number, PlanetName: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "post",
        url: "/api/PlanetsRequests",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            Planet_id: PlanetId,
            serial_number: serialNumber
        }
    }

    try {
        dispatch(PlanetSlice.actions.PlanetsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        dispatch(fetchPlanets())
        const successText = errorText || `Планета "${PlanetName}" добавлена`
        dispatch(PlanetSlice.actions.PlanetAddedIntoFlight([errorText, successText]));
        setTimeout(() => {
            dispatch(PlanetSlice.actions.PlanetAddedIntoFlight(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(PlanetSlice.actions.PlanetsFetchedError(`${e}`))
    }
}

export const deleteFlight = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "delete",
        url: "/api/Flights",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: id
        }
    }
    try {
        dispatch(flightSlice.actions.FlightsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка удалена`
        dispatch(flightSlice.actions.FlightsUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchFlights())
        }
        setTimeout(() => {
            dispatch(flightSlice.actions.FlightsUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(flightSlice.actions.FlightsDeleteError(`${e}`))
    }
}

export const makeFlight = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: `/api/FlightsUser/${id}`, // изменение здесь: id внесён в URL
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }
    try {
        dispatch(flightSlice.actions.FlightsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка создана`
        dispatch(flightSlice.actions.FlightsUpdated([errorText, successText]));
        if (successText !== "") {
            dispatch(fetchFlights())
        }
        setTimeout(() => {
            dispatch(flightSlice.actions.FlightsUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(flightSlice.actions.FlightsDeleteError(`${e}`))
    }
}

export const fetchFlights = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(flightSlice.actions.FlightsFetching())
        const response = await axios.get<IRequest>(`/api/Flights`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse = response.data.Flights;

        dispatch(flightSlice.actions.FlightsFetched(transformedResponse))
    } catch (e) {
        dispatch(flightSlice.actions.FlightsFetchedError(`${e}`))
    }
}

export const fetchFlightById = (
    id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    interface ISingleflightResponse {
        Flight: IFlight,
    }

    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(flightSlice.actions.FlightsFetching())

        const response = await axios.get<ISingleflightResponse>(`/api/Flights/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        setPage(response.data.Flight.ams, response.data.Flight.id)

        dispatch(flightSlice.actions.FlightFetched(response.data.Flight))

    } catch (e) {
        console.log("aboba")
        dispatch(flightSlice.actions.FlightsFetchedError(`${e}`))
    }
}


export const deleteFlightById = (planet_id: number,fr_id:number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(flightSlice.actions.FlightsFetching())
        const response = await axios.delete<IDeletePlanetRequest>(`/api/PlanetsRequests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                fr_id:fr_id,
                planet_id: planet_id,
            },
        });
        dispatch(flightSlice.actions.FlightsDeleteSuccess(response.data))
        dispatch(fetchFlights())
    } catch (e) {
        dispatch(flightSlice.actions.FlightsFetchedError(`${e}`))
    }
}

// export const fetchFlightById = (
//     id: string,
//     setPage: (name: string, id: number) => void
// ) => async (dispatch: AppDispatch) => {
//     interface ISingleFlightResponse {
//         Flight: IFlight,
//     }
//
//     const accessToken = Cookies.get('jwtToken');
//     dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
//     try {
//         dispatch(flightSlice.actions.FlightsFetching())
//         const response = await axios.get<ISingleFlightResponse>(`/api/v3/Flights/${id}`, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`
//             }
//         });
//         setPage(response.data.Flight.flight, response.data.Flight.id)
//         dispatch(flightSlice.actions.FlightsFetched(response.data.Flight))
//     } catch (e) {
//         dispatch(flightSlice.actions.FlightsFetchedError(`${e}`))
//     }
// }
export const updateFlight = (
    id: number,
    ams: string,
    // startDate: string,
    // endDate: string,
    // leader: string
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "put",
        url: "/api/Flights",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: "application/json"
        },
        data: {
            ams: ams,
            id: id,
        }
    };

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(flightSlice.actions.FlightsUpdated([errorText, successText]));
        setTimeout(() => {
            dispatch(flightSlice.actions.FlightsUpdated(['', '']));
        }, 5000);
    } catch (e) {
        dispatch(flightSlice.actions.FlightsFetchedError(`${e}`));
    }
}

export const fetchPlanet = (
    PlanetId: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    try {
        dispatch(PlanetSlice.actions.PlanetsFetching())
        // Теперь предполагаем, что response.data.Planets - это объект, а не массив
        const response = await axios.get<{ Planets: IPlanet}>(`/api/Planet/${PlanetId}`)
        console.log(response.data)
        const Planet = response.data.Planets  // Убрана индексация [0], так как это не массив
        console.log(Planet)
        setPage(Planet.name ?? "Без названия", Planet.id)
        dispatch(PlanetSlice.actions.PlanetFetched(Planet))
    } catch (e) {
        console.log(`Ошибка загрузки планет: ${e}`)
        const previewID = PlanetId !== undefined ? parseInt(PlanetId, 10) - 1 : 0;
        const mockPlanet = mockPlanets[previewID]
        setPage(mockPlanet.name ?? "Без названия", mockPlanet.id)
        dispatch(PlanetSlice.actions.PlanetFetched(mockPlanet))
    }
}

export const registerSession = (userName: string, login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/signup",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            'user_name': userName,
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IRegisterResponse>(config);
        const errorText = response.data.login == '' ? 'Ошибка регистрации' : ''
        const successText = errorText || "Регистрация прошла успешно"
        dispatch(userSlice.actions.setStatuses([errorText, successText]))
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000)
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

export const logoutSession = () => async (dispatch: AppDispatch) => {
    // Cookies.remove('jwtToken');
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "get",
        url: "/api/logout",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios(config);
        const errorText = response.data.login == '' ? 'Ошибка регистрации' : ''
        const successText = errorText || "Прощайте :("
        dispatch(userSlice.actions.setStatuses([errorText, successText]))

        if (errorText == '') {
            Cookies.remove('jwtToken');
            dispatch(userSlice.actions.setAuthStatus(false))
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000)
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}


export const loginSession = (login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/login",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IAuthResponse>(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Авторизация прошла успешна"
        dispatch(userSlice.actions.setStatuses([errorText, successText]));
        const jwtToken = response.data.access_token
        if (jwtToken) {
            Cookies.set('jwtToken', jwtToken);
            dispatch(userSlice.actions.setAuthStatus(true));
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000);
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

// MARK: - Mock data

function filterMockData(searchValue?: string) {
    if (searchValue) {
        const filteredPlanets = mockPlanets.filter(Planet =>
            Planet.name?.toLowerCase().includes((searchValue ?? '').toLowerCase())
        );
        if (filteredPlanets.length === 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.getElementById('search-text-field').value = ""
            alert("Данных нету")

        }
        return filteredPlanets
    }
    return mockPlanets
}

export function DateFormat(dateString: string) {
    if (dateString == "0001-01-01T00:00:00Z") {
        return "Дата не указана"
    }
    const date = new Date(dateString);
    return `${date.getDate()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`
}

export function emptyString(text: string, emptyText: string) {
    return text == "" ? emptyText : text
}

export const convertServerDateToInputFormat = (serverDate: string) => {
    const dateObject = new Date(serverDate);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

function convertInputFormatToServerDate(dateString: string): string {
    const dateRegex = /^4-2-2T2:2:2Z2:2/;
    if (dateRegex.test(dateString)) {
        return dateString;
    } else {
        const date = new Date(dateString);
        const isoDate = date.toISOString();
        return isoDate;
    }
}

