import {AppDispatch} from "../store.ts";
import axios from "axios";
import {
    IAuthResponse,
    IPlanetResponse,
    IPlanetWithBasket, IDefaultResponse,
    IDeletePlanetRequest, IFlight,
    IFlightResponse, IRegisterResponse,
    IRequest,
    mockPlanets, IPlanet, IUpdatePlanetNumberInRequest, IupdatedPlanetRequest
} from "../../models/models.ts";
import Cookies from 'js-cookie';
import {PlanetSlice} from "./PlanetSlice.ts"
import {FlightSlice} from "./FlightSlice.ts";
import {userSlice} from "./UserSlice.ts";
import {fr} from "date-fns/locale";


export const fetchPlanets = (searchValue?: string, makeLoading: boolean = true) => async (dispatch: AppDispatch) => {
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
        if (makeLoading) {
            dispatch(PlanetSlice.actions.PlanetsFetching())
        }
        const response = await axios<IPlanetWithBasket>(config);
        dispatch(PlanetSlice.actions.PlanetsFetched([response.data.Planets, response.data.Flight_id]))
    } catch (e) {
        // dispatch(PlanetSlice.actions.PlanetsFetchedError(`Пожалуйста, авторизуйтесь (`))
        dispatch(PlanetSlice.actions.PlanetsFetched([filterMockData(searchValue), 0]))
    }
}

export const deleteSpecRequestById = (
    id: number,
    Flight_id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios.delete<IDeletePlanetRequest>(`/api/PlanetsRequests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                id: id,
            },
        });
        dispatch(FlightSlice.actions.FlightsDeleteSuccess(response.data))
        dispatch(fetchFlightById(Flight_id, setPage))
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`))
    }
}

export const updatePlanetInfo = (
    id: number,
    name: string,
    description: string,

) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));



    const config = {
        method: "put",
        url: `/api/Planets/${id}`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: id,
            name: name,
            description: description,
        },
    }

    try {
        dispatch(PlanetSlice.actions.PlanetsFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Данные обновленны' : ''
        dispatch(PlanetSlice.actions.PlanetAddedIntoFlight([error, success]))
        dispatch(fetchPlanets())
    } catch (e) {
        dispatch(PlanetSlice.actions.PlanetsFetchedError(`Ошибка: ${e}`))
    }
}

export const updatePlanetImage = (PlanetId: number, file: File) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('Planet_id', `${PlanetId}`);

    const config = {
        method: "put",
        url: `/api/Planets/upload-image`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: formData,
    }

    try {
        dispatch(PlanetSlice.actions.PlanetsFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Фото обновленно' : ''
        dispatch(PlanetSlice.actions.PlanetAddedIntoFlight([error, success]))
        dispatch(fetchPlanets())
    } catch (e) {
        dispatch(PlanetSlice.actions.PlanetsFetchedError(`Ошибка: ${e}`))
    }
}

export const deleteFlightById = (planet_id: number,flight_id:number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios.delete<IDeletePlanetRequest>(`/api/PlanetsRequests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                planet_id: planet_id,
                fr_id: flight_id
            },
        });
        dispatch(FlightSlice.actions.FlightsDeleteSuccess(response.data))
        dispatch(fetchFlightById2(flight_id))
        console.log("delete")
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`))
    }
}
export const flightUp = (planet_id: number,fr_id:number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios.put<IupdatedPlanetRequest>(`/api/PlanetsRequests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                Planet_id: planet_id,
                fr_id: fr_id,
                command: 2
            },
        });
        dispatch(FlightSlice.actions.FlightsUpDownSuccess(response.data))
        dispatch(fetchFlightById2(fr_id))
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`))
    }
}
export const flightDown = (planet_id: number,fr_id:number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios.put<IupdatedPlanetRequest>(`/api/PlanetsRequests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                Planet_id: planet_id,
                fr_id: fr_id,
                command: 1
            },
        });
        dispatch(FlightSlice.actions.FlightsUpDownSuccess(response.data))
        dispatch(fetchFlightById2(fr_id))
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`))
    }
}

export const deletePlanet = (PlanetId: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));

    const config = {
        method: "delete",
        url: `/api/Planets`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: PlanetId
        },
    }

    try {
        dispatch(PlanetSlice.actions.PlanetsFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Планета удалена' : ''
        dispatch(PlanetSlice.actions.PlanetAddedIntoFlight([error, success]))
        dispatch(fetchPlanets())
    } catch (e) {
        dispatch(PlanetSlice.actions.PlanetsFetchedError(`Ошибка: ${e}`))
    }
}

export const addPlanetIntoFlight = (PlanetId: number, flight_number: number, PlanetName: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "post",
        url: "/api/PlanetsRequests",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            Planet_id: PlanetId,
            flight_number: flight_number
        }
    }

    try {
        // dispatch(PlanetSlice.actions.PlanetsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Планета "${PlanetName}" добавлена`
        dispatch(PlanetSlice.actions.PlanetAddedIntoFlight([errorText, successText]));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dispatch(fetchPlanets(null, false))
        setTimeout(() => {
            dispatch(PlanetSlice.actions.PlanetAddedIntoFlight(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(PlanetSlice.actions.PlanetsFetchedError(`${e}`))
    }
}


export const userupdateflight = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: `/api/FlightsUser/${id}`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: id
        }
    }
    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка обновлена`
        dispatch(FlightSlice.actions.FlightsUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchFlights())
        }
        setTimeout(() => {
            dispatch(FlightSlice.actions.FlightsUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsDeleteError(`${e}`))
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
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка удалена`
        dispatch(FlightSlice.actions.FlightsUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchFlights())
        }
        setTimeout(() => {
            dispatch(FlightSlice.actions.FlightsUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsDeleteError(`${e}`))
    }
}

export const makeFlight = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: `/api/FlightsUser/${id}`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },


    }
    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка создана`
        dispatch(FlightSlice.actions.FlightsUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchFlights())
        }
        setTimeout(() => {
            dispatch(FlightSlice.actions.FlightsUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsDeleteError(`${e}`))
    }
}

export const moderatorUpdateStatus = (FlightId: number, status: string, modername: string) => async (dispatch: AppDispatch) => {

    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: `/api/FlightsModer/${FlightId}`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            status: status,
            modername: modername
        }
    }
    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Ответ принят`
        dispatch(FlightSlice.actions.FlightsUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchFlights())
        }
        setTimeout(() => {
            dispatch(FlightSlice.actions.FlightsUpdated(['', '']));
        }, 3000);
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsDeleteError(`${e}`))
    }
}

export const fetchFlights = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios.get<IFlightResponse>(`/api/Flights`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            Flights: response.data.Flights,
            status: response.data.status
        };
        dispatch(FlightSlice.actions.FlightsFetched(transformedResponse))
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`))
    }
}

export const fetchCurrentFlight = () => async (dispatch: AppDispatch) => {
    interface ISingleFlightResponse {
        Flights: number,
    }

    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        const response = await axios.get<ISingleFlightResponse>(`/api/Flights/current`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        dispatch(PlanetSlice.actions.setBasket(response.data.Flights))

    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`))
    }
}

export const fetchFlightById = (
    id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    interface ISingleFlightResponse {
        Flight: IFlight,
    }

    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios.get<ISingleFlightResponse>(`/api/Flights/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        setPage(response.data.Flight.ams, response.data.Flight.id)
        dispatch(FlightSlice.actions.FlightFetched(response.data.Flight))
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`))
    }
}
export const fetchFlightById2 = (
    id: string,
) => async (dispatch: AppDispatch) => {
    interface ISingleFlightResponse {
        Flight: IFlight,
    }

    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios.get<ISingleFlightResponse>(`/api/Flights/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        dispatch(FlightSlice.actions.FlightFetched(response.data.Flight))
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`))
    }
}

export const fetchFlightsFilter = (dateStart?: string, dateEnd?: string, status?: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(FlightSlice.actions.FlightsFetching())

        // Создание новых параметров запроса
        const queryParams = new URLSearchParams();
        if (dateStart) {
            queryParams.set('date_formation_start', dateStart);
        }
        if (dateEnd) {
            queryParams.set('date_formation_end', dateEnd);
        }
        if (status) {
            queryParams.set('status', status);
        }

        const urlWithParams = `/api/Flights${queryParams.toString() ? `?${queryParams}` : ''}`;
        const response = await axios.get<IFlightResponse>(urlWithParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            Flights: response.data.Flights,
            status: response.data.status
        };
        // console.log(transformedResponse.Flights)
        dispatch(FlightSlice.actions.FlightsFetched(transformedResponse))
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`))
    }
}


export const deleteDestFlightById = (
    id: number,
    Flight_id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(FlightSlice.actions.FlightsFetching())
        const response = await axios.delete<IDeletePlanetRequest>(`/api/PlanetsRequests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                id: id,
            //     НАДО ПЕРЕДАВАТЬ ДВА АЙДИ
            },
        });
        dispatch(FlightSlice.actions.FlightsDeleteSuccess(response.data))
        dispatch(fetchFlightById(Flight_id, setPage))
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`))
    }
}

export const updateFlight = (
    id: number,
    FlightName: string,

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
            ams: FlightName,
            id: id,
        }
    };

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(FlightSlice.actions.FlightsUpdated([errorText, successText]));
        setTimeout(() => {
            dispatch(FlightSlice.actions.FlightsUpdated(['', '']));
        }, 5000);
    } catch (e) {
        dispatch(FlightSlice.actions.FlightsFetchedError(`${e}`));
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

export const createPlanet = (
    PlanetName?: string,
    description?: string,
    image?: File | null
) => async (dispatch: AppDispatch) => {
    const formData = new FormData();
    if (PlanetName) {
        formData.append('Planet_name', PlanetName);
    }
    if (description) {
        formData.append('description', description);
    }
    if (image) {
        formData.append('image', image);
    }
    formData.append('status_id', '1');
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "post",
        url: "/api/Planets",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    };

    try {
        dispatch(PlanetSlice.actions.PlanetsFetching())
        const response = await axios(config);
        const errorText = response.data.description || ''
        const successText = errorText == '' ? "Планета создана" : ''
        dispatch(PlanetSlice.actions.PlanetAddedIntoFlight([errorText, successText]))
        setTimeout(() => {
            dispatch(PlanetSlice.actions.PlanetAddedIntoFlight(['', '']));
        }, 6000)

    } catch (e) {
        // dispatch(PlanetSlice.actions.PlanetsFetchedError(`Планета добавлена`));
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
    const accessToken = Cookies.get('jwtToken');
    Cookies.remove('jwtToken');

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
        const errorText = response.data.login == '' ? 'Ошибка разлогина' : ''
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
        const successText = errorText || "Добро пожаловать :)"
        dispatch(userSlice.actions.setStatuses([errorText, successText]));
        const jwtToken = response.data.access_token
        dispatch(userSlice.actions.setRole(response.data.role ?? ''))
        if (jwtToken) {
            Cookies.set('jwtToken', jwtToken);
            Cookies.set('role', response.data.role ?? '');
            dispatch(userSlice.actions.setAuthStatus(true));
            // Cookies.set('userImage', response.data.userImage)
            Cookies.set('userName', response.data.userName)
            Cookies.set('userId', response.data.userid)
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