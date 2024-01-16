
import {FC, useEffect, useState} from "react";
import TableView from "../TableView/TableView.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {
    convertServerDateToInputFormat,
    emptyString, fetchFlightById,
    makeFlight,
    updateFlight
} from "../../store/reducers/ActionCreator.ts";
import {IFlight} from "../../models/models.ts";
import MyComponent from "../Popup/Popover.tsx";
import LoadAnimation from "../Popup/MyLoaderComponent.tsx";

import {Link, useNavigate, useParams} from "react-router-dom";


interface FlightCardProps {
    setPage: (name: string, id: number) => void
}

const FlightCard: FC<FlightCardProps> = ({setPage}) => {
    const {flight_id} = useParams();
    const dispatch = useAppDispatch();
    const {Flight, isLoading, error, success} = useAppSelector(state => state.FlightReducer);
    const {isAuth} = useAppSelector(state => state.userReducer);
    const [startFlightDate, setStartFlightDate] = useState('');
    const [endFlightDate, setEndFlightDate] = useState('');
    const navigate = useNavigate()
    const [FlightName, setFlightName] = useState('$');

    useEffect(() => {
        if(flight_id) {
            console.log("13123123")
            dispatch(fetchFlightById(flight_id, setPage));
        }
    }, []);





    const handleMakeRequest = (id:number) => {
        dispatch(makeFlight(id))
        navigate(-1)
    }

    const handleSave = (id: number, Flight: IFlight) => {
        dispatch(
            updateFlight(id, FlightName == '$' ? Flight.ams : FlightName)
        )
    }

    if (!isAuth) {
        return <Link to="/login" className="btn btn-outline-danger">
            Требуется войти в систему
        </Link>
    }


    return (

        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            {(!Flight) && <h1>Заявок нет</h1>}



            {Flight &&
                    <div className='card-block'>
                        <div className="card">
                            <h3>Статус заявки: {Flight.status}</h3>
                            <div className="info">
                                <div className="author-info">
                                    <div>
                                        <p>@{emptyString("Логин пользователя:  " + Flight.user_login, 'Логин не задан')}</p>
                                    </div>
                                </div>

                                <div className="dates-info">
                                    <p>
                                        Дата создания:
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={startFlightDate || convertServerDateToInputFormat(Flight.date_create)}
                                            onChange={(e) => setStartFlightDate(e.target.value)}
                                            disabled={Flight.status != "в работе"}
                                        />
                                    </p>
                                    <p>
                                        Дата формирования:
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={endFlightDate || convertServerDateToInputFormat(Flight.date_formation)}
                                            onChange={(e) => setEndFlightDate(e.target.value)}
                                            disabled={Flight.status != "в работе"}
                                        />
                                    </p>

                                </div>

                            </div>
                            <div className="detail-info">
                                <>АМС</>
                                <input
                                    type="text"
                                    className="form-control bg-black text-white"
                                    value={FlightName == "$" ? Flight.ams : FlightName}
                                    onChange={(e) => setFlightName(e.target.value)}
                                    style={{marginBottom: '20px'}}
                                    disabled={Flight.status == "в работе"}
                                />

                            </div>
                            <div style={{textAlign: 'right'}}>
                                {Flight.status != "в работе" && <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    onClick={() => handleSave(Flight.id, Flight)}
                                    style={{width: '150px', marginTop: '15px'}}
                                >
                                    Сохранить
                                </button>}
                            </div>
                        </div>
                        <TableView planets_request={Flight.planets_request} status={Flight.status}/>
                        {
                            Flight.status != "в работе" && (
                                <div className='delete-make'>
                                    <div style={{textAlign: 'left', flex: 1}}>
                                    </div>
                                    <div style={{textAlign: 'right', flex: 1}}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-light"
                                            onClick={() => handleMakeRequest(Flight.id)}
                                        >
                                            Сформировать
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                }
        </>
    );
};


export default FlightCard;


