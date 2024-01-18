import {FC, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchFlights, fetchFlightsFilter, moderatorUpdateStatus} from "../../store/reducers/ActionCreator.ts";
import MyComponent from "../Popup/Popover.tsx";
import {Link} from "react-router-dom";
import "./DatePickerStyles.css";
import "./RequestView.css";
import {Dropdown, Form, Button, Container, Row, Col} from "react-bootstrap";
import {format} from "date-fns";
import {useNavigate} from 'react-router-dom';
import Cookies from "js-cookie";
import {IFlight} from "../../models/models.ts";
import {progressSlice} from "../../store/reducers/ProgressData.ts";
import ru from 'date-fns/locale/ru'
interface RequestViewProps {
    setPage: () => void;
}

const RequestView: FC<RequestViewProps> = ({setPage}) => {
    const {searchValue, datestart, dateend} = useAppSelector(state => state.progressReducer)
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {Flight, error, success} = useAppSelector((state) => state.FlightReducer);
    const {singleFlight, successs, errorr} = useAppSelector(state => state.FlightReducer)

    const {isAuth} = useAppSelector((state) => state.userReducer);
    const [startDate, setStartDate] = useState<Date | null>(datestart);
    const [endDate, setEndDate] = useState<Date | null>(dateend);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const role = Cookies.get('role')
    const [filteredFlights, setFilteredFlights] = useState<IFlight[] | null>(null);
    const [filteredByUsers, setFilteredUsers] = useState<IFlight[] | null>(null);
    const [textValue, setTextValue] = useState<string>('');
    const modername = Cookies.get('userName')

    useEffect(() => {
        setPage();
        dispatch(fetchFlights());

        const handleFilterInterval = setInterval(() => {
            handleFilter();
        }, 3000);

        const cleanup = () => {
            clearInterval(handleFilterInterval);
        };

        window.addEventListener('beforeunload', cleanup);

        return () => {
            cleanup();
            window.removeEventListener('beforeunload', cleanup);
        };
    }, [startDate, endDate, selectedStatus]);


    const resetFilter = () => {
        setStartDate(null)
        setEndDate(null)
        setSelectedStatus('')
    }

    const handlerApprove = (Flight_id) => {
        dispatch(moderatorUpdateStatus(Flight_id, "завершён", modername))
        setTimeout(() => {
            navigate("/request"); // Предполагаемое действие для повторной загрузки данных из бекенда
        }, 2);
    }

    const handleDiscard = (Flight_id) => {
        dispatch(moderatorUpdateStatus(Flight_id, "отклонён", modername))
        setTimeout(() => {
            navigate("/request"); // Предполагаемое действие для повторной загрузки данных из бекенда
        }, 2);
    }

    const handleFilter = () => {
        const formatDate = (date: Date | null | undefined): string | undefined => {
            if (!date) {
                return undefined;
            }
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        if (role == '2') {
        dispatch(fetchFlightsFilter(formattedStartDate, formattedEndDate, selectedStatus));
        } else {
            localFilter(formattedStartDate, formattedEndDate)
        }
    };

    function formatDate2(inputDate: string): string {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const formattedDate = `${year}-${month}-${day}`
        return formattedDate
    }

    const localFilter = (startDateString: string | undefined, endDateString: string | undefined) => {

        function isDateInRange(date: string): boolean {
            const bdDateString = formatDate2(date)
            const bdDate = new Date(bdDateString)
            const start = startDateString ? new Date(startDateString) : new Date('0001-01-01')
            const end = endDateString ? new Date(endDateString) : new Date('2033-12-21')
            return (!startDate || bdDate > start) && (!endDate || bdDate < end)
        }

        if (Flight) {
            const d = Flight.Flights.filter(obj => isDateInRange(obj.date_create))
            setFilteredFlights(d)
        }
    }

    const clickCell = (cellID: number) => {
        navigate(`/Flights/${cellID}`);
    }

    if (!isAuth) {
        return (
            <Link to="/login" className="btn btn-outline-danger">
                Требуется войти в систему
            </Link>
        );
    }

    const handleInputChange = () => {
        if (Flight) {
            const d = Flight.Flights.filter(obj => obj.user_login == textValue)
            setFilteredUsers(d.length == 0 ? null : d)
        }
    };



    return (
        <>
            <div className="d-flex justify-content-end mt-3 pe-4 mx-5">
                <div className="filter-section">

                    {role && (
                        <>
                            {role === '2' &&
                                <Form.Group controlId="exampleForm.ControlInput1" className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Введите пользователя"
                                        value={textValue}
                                        onChange={(e) => setTextValue(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleInputChange();
                                            }
                                        }}
                                        style={{width: '200px'}}
                                    />
                                </Form.Group>
                            }

                            <label>Начало диапазона формирования:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => {
                                    setStartDate(date)
                                    dispatch(progressSlice.actions.setStartDate)
                                }}
                                // setStartDate(date)
                                className="custom-datepicker mb-2"
                                popperPlacement="bottom-start"
                                locale={ru}
                            />

                            <label>Конец диапазона формирования:</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => {
                                    setEndDate(date)
                                    dispatch(progressSlice.actions.setEndDate)
                            }}
                                className="custom-datepicker mb-2"
                                popperPlacement="bottom-start"
                                locale={ru}
                            />

                            {role === '2' && (
                                <>
                                    <label>Статус полёта:</label>
                                    <Form.Select
                                        className="mb-2"
                                        style={{width: '170px'}}
                                        value={selectedStatus || ""}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="">Выберите статус</option>
                                        <option value="в работе">В работе</option>
                                        <option value="завершён">Завершён</option>
                                        <option value="отклонён">Отклонён</option>
                                    </Form.Select>
                                </>
                            )}

                            <Button
                                style={{width: '120px'}}
                                className="mb-2"
                                onClick={handleFilter}
                            >
                                Применить
                            </Button>
                            <Button
                                variant="outline-danger"
                                style={{width: '120px'}}
                                className="mb-2"
                                onClick={resetFilter}
                            >
                                Сбросить
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* =================================== TABLE ADMIN =============================================*/}
            {Flight &&
                <table className='table-Flights'>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название АМС</th>
                        <th>Дата создания</th>
                        <th>Дата формирования</th>
                        <th>Результат</th>
                        {role == '2' &&
                            <th>Модератор</th>
                        }
                        {role == '2' &&
                            <th>Логин пользователя</th>
                        }
                        <th>Статус</th>
                        {role == '2' &&
                            <th>Действия</th>
                        }
                    </tr>
                    </thead>
                    <tbody>

                    {filteredFlights && role != '2'
                        ? filteredFlights.map((Flight) => (
                            <tr key={Flight.id} onClick={() => clickCell(Flight.id)}>
                                <td>{Flight.id}</td>
                                <td>{Flight.ams || 'Не задано'}</td>
                                <td>{checkData(Flight.date_create)}</td>
                                <td>{checkData(Flight.date_formation)}</td>
                                <td>{Flight.result || 'Результатов нет'}</td>
                                <td>{Flight.status}</td>
                            </tr>
                        ))
                        : (filteredByUsers ? filteredByUsers : Flight.Flights).map((Flight) => (
                            <tr key={Flight.id} onClick={() => clickCell(Flight.id)}>
                                <td>{Flight.id}</td>
                                <td>{Flight.ams || 'Не задано'}</td>
                                <td>{checkData(Flight.date_create)}</td>
                                <td>{checkData(Flight.date_formation)}</td>
                                <td>{Flight.result || 'Результатов нет'}</td>
                                {role == '2' &&
                                <td>{Flight.moder_login || 'не назначен'}</td>
                                }
                                {role == '2' &&
                                <td>{Flight.user_login || 'Не задано'}</td>
                                }
                                <td>{Flight.status}</td>

                                {Flight.status === "в работе" && role == "2" &&(
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => handleDiscard(Flight.id)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Отклонить
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-light"
                                                onClick={() => handlerApprove(Flight.id)}
                                            >
                                                Завершить
                                            </button>
                                        </td>
                                    )}


                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    );
};

export default RequestView;

function checkData(data: string): string {
    if (data == '0001-01-01T00:00:00Z') {
        return 'Дата не задана'
    }
    const formattedDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'dd.MM.yyyy');
    };

    const formatted = formattedDate(data);
    return formatted
}
