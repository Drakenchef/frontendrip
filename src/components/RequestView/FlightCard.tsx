import {FC, useEffect, useState} from 'react';
import "../RequestView/RequestView.css";
import {
    convertServerDateToInputFormat, DateFormat,
    deleteFlight,
    emptyString, fetchFlightById,
    makeFlight, moderatorUpdateStatus,
    updateFlight, userupdateflight
} from '../../store/reducers/ActionCreator';
import TableView from '../TableView/TableView.tsx';
import {IFlight} from '../../models/models.ts';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import Cookies from "js-cookie";
import {useNavigate, useParams} from "react-router-dom";
import MyComponent from "../Popup/Popover.tsx";

interface FlightCardProps {
    setPage: (ams: string, id: number) => void
}


const FlightCard: FC<FlightCardProps> = ({setPage}) => {
    const {Flight_id} = useParams();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const {singleFlight, success, error} = useAppSelector(state => state.FlightReducer);
    const [startFlightDate, setStartFlightDate] = useState('');
    const [endFlightDate, setEndFlightDate] = useState('');
    const [leader, setLeader] = useState('$');
    const [description, setDescription] = useState('$');
    const [FlightName, setFlightName] = useState('$');
    const role = Cookies.get('role')
    const modername = Cookies.get('userName')


    useEffect(() => {
        if (Flight_id) {
            dispatch(fetchFlightById(Flight_id, setPage))
        }
    }, []);

    const handleDeleteFlight = (id: number) => {
        dispatch(userupdateflight(id))
        navigate(-1);
    }

    const handlerApprove = () => {
        if (singleFlight) {
            dispatch(moderatorUpdateStatus(singleFlight.id, "завершён", modername))

            navigate(-1);
        }
    }

    const handleDiscard = () => {
        if (singleFlight) {
            dispatch(moderatorUpdateStatus(singleFlight.id, "отклонён", modername))
            navigate(-1);
        }
    }

    const handleMakeRequest = (id: number) => {
        dispatch(makeFlight(id))

        navigate("/Planets");

    }

    const handleSave = (id: number, Flight: IFlight) => {
        dispatch(
            updateFlight(
                id,
                FlightName == '$' ? Flight.ams : FlightName,

            )
        )
    }

    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <div className='mx-5 mb-5'>
                {
                    singleFlight && <>
                        {/* ======================= ШАПКА =============================== */}

                        <div className="card">
                            <h3>Статус: {singleFlight.status}</h3>
                            <div className="info">
                                <div className="author-info">
                                    {/*<img src={singleFlight.user} alt="Фото Автора" className="author-img"/>*/}
                                    <div>
                                        {/*<h4>{emptyString(singleFlight.user.user_name, "Имя не задано")}</h4>*/}
                                        {/*<p>Профессия: {emptyString(singleFlight.user, 'Профессия не задана')}</p>*/}
                                        <p>@{emptyString("Логин пользователя: " + singleFlight.user_login, 'Логин на задан')}</p>
                                    </div>
                                </div>

                                {/*<div className="dates-info">*/}
                                {/*    <p>*/}
                                {/*        Начало сканирования:*/}
                                {/*        <input*/}
                                {/*            type="date"*/}
                                {/*            className="form-control"*/}
                                {/*            value={startFlightDate || convertServerDateToInputFormat(singleFlight.date_formation)}*/}
                                {/*            onChange={(e) => setStartFlightDate(e.target.value)}*/}
                                {/*            disabled={singleFlight.status != "создан"}*/}
                                {/*        />*/}
                                {/*    </p>*/}
                                {/*    /!*<p>*!/*/}
                                {/*    /!*    Конец похода:*!/*/}
                                {/*    /!*    <input*!/*/}
                                {/*    /!*        type="date"*!/*/}
                                {/*    /!*        className="form-control"*!/*/}
                                {/*    /!*        value={endFlightDate || convertServerDateToInputFormat(singleFlight.вф)}*!/*/}
                                {/*    /!*        onChange={(e) => setEndFlightDate(e.target.value)}*!/*/}
                                {/*    /!*        disabled={singleFlight.status != "создан"}*!/*/}
                                {/*    /!*    />*!/*/}
                                {/*    /!*</p>*!/*/}
                                {/*    /!*<p>*!/*/}
                                {/*    /!*    Лидер похода:*!/*/}
                                {/*    /!*    <input*!/*/}
                                {/*    /!*        type="text"*!/*/}
                                {/*    /!*        className="form-control bg-black text-white"*!/*/}
                                {/*    /!*        value={leader == "$" ? singleFlight.leader : leader}*!/*/}
                                {/*    /!*        onChange={(e) => setLeader(e.target.value)}*!/*/}
                                {/*    /!*        disabled={singleFlight.status != "создан"}*!/*/}
                                {/*    /!*    />*!/*/}
                                {/*    /!*</p>*!/*/}
                                {/*</div>*/}

                            </div>
                            <div className="detail-info">
                                <>Название АМС</>
                                <input
                                    type="text"
                                    placeholder="Введите название амс"
                                    className="form-control bg-black text-white"
                                    value={FlightName == "$" ? singleFlight.ams : FlightName}
                                    onChange={(e) => setFlightName(e.target.value)}
                                    style={{marginBottom: '20px'}}
                                    disabled={singleFlight.status == "в работе"}
                                />

                            </div>
                            <div style={{textAlign: 'right'}}>
                                {singleFlight.status == "создан" && <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    onClick={() => handleSave(singleFlight.id, singleFlight)}
                                    style={{width: '150px', marginTop: '15px'}}
                                >
                                    Сохранить
                                </button>}
                            </div>
                        </div>

                        {/* ======================= ТАБЛИЦА ============================= */}

                        <TableView
                            setPage={setPage}
                            FlightID={Flight_id ?? ''}
                            planets_request={singleFlight.planets_request}
                            status={singleFlight.status}
                        />

                        {/* ======================= КНОПКИ ============================= */}

                        <div className='delete-make' style={{display: 'flex', gap: '10px'}}>
                            {singleFlight.status == "в работе" &&  role == '0' && (
                                <div style={{flex: 1}}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleDeleteFlight(singleFlight.id)}
                                    >
                                        Отменить
                                    </button>
                                </div>
                            )}

                            {singleFlight.status == "создан" && (
                                <div style={{flex: 1}}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-light"
                                        onClick={() => handleMakeRequest(Flight_id)}
                                    >
                                        Сформировать
                                    </button>
                                </div>
                            )}

                            {/*{singleFlight.status == "в работе" && role == '2' && (*/}
                            {/*    <>*/}
                            {/*        <div style={{flex: 1}}>*/}
                            {/*            <button*/}
                            {/*                type="button"*/}
                            {/*                className="btn btn-outline-danger"*/}
                            {/*                onClick={() => handleDiscard()}*/}
                            {/*            >*/}
                            {/*                Отклонить*/}
                            {/*            </button>*/}
                            {/*        </div>*/}

                            {/*        <div style={{flex: 1}}>*/}
                            {/*            <button*/}
                            {/*                type="button"*/}
                            {/*                className="btn btn-outline-light"*/}
                            {/*                onClick={handlerApprove}*/}
                            {/*            >*/}
                            {/*                Завершить*/}
                            {/*            </button>*/}
                            {/*        </div>*/}
                            {/*    </>*/}
                            {/*)}*/}
                        </div>
                    </>
                }
            </div>
        </>
    );
};

export default FlightCard;
