import {FC, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchFlights} from "../../store/reducers/ActionCreator.ts";
import MyComponent from "../Popup/Popover.tsx";
import {Link} from "react-router-dom";
import "./DatePickerStyles.css";
import "./RequestView.css";
import {Dropdown, Form, Button, Container, Row, Col} from "react-bootstrap";
import {format} from "date-fns";
import {useNavigate} from 'react-router-dom';
import Cookies from "js-cookie";
import {IFlight} from "../../models/models.ts";

interface RequestViewProps {
    setPage: () => void;
}

const RequestView: FC<RequestViewProps> = ({setPage}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {Flights, error, success} = useAppSelector((state) => state.FlightReducer);
    const {isAuth} = useAppSelector((state) => state.userReducer);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const role = Cookies.get('role')

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

    // const handleInputChange = () => {
    //     if (Flights) {
    //         const d = Flights.filter(obj => obj.user_login == textValue)
    //         setFilteredUsers(d.length == 0 ? null : d)
    //     }
    // };

    return (
        <>
            {/*<Container className="d-flex justify-content-center">*/}
            {/*    <Row>*/}
            {/*        <Col>*/}
            {/*            <Form.Group controlId="exampleForm.ControlInput1">*/}
            {/*                <Form.Label>Фильтрация по пользователю</Form.Label>*/}
            {/*                <Form.Control*/}
            {/*                    type="text"*/}
            {/*                    placeholder="Введите текст"*/}
            {/*                    value={textValue}*/}
            {/*                    onChange={(e) => setTextValue(e.target.value)}*/}
            {/*                    // onKeyPress={(e) => {*/}
            {/*                    //     if (e.key === 'Enter') {*/}
            {/*                    //         handleInputChange();*/}
            {/*                    //     }*/}
            {/*                    // }}*/}
            {/*                    style={{width: '100%'}}*/}
            {/*                />*/}
            {/*            </Form.Group>*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            {/*</Container>*/}

            {/* =================================== ALERTS ===========================================*/}

            {error !== "" && <MyComponent isError={true} message={error}/>}
            {success !== "" && <MyComponent isError={false} message={success}/>}

            {/* =================================== FILTERS ======================================*/}
            {role &&
                <div className="filter-section d-flex justify-content-end mb-3 pe-4">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Фильтры
                        </Dropdown.Toggle>

                        <Dropdown.Menu className={'px-2'}>
                            <label>Дата создания с:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="custom-datepicker"
                                popperPlacement="bottom-start"
                            />

                            <label>Дата окончания по:</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                className="custom-datepicker"
                                popperPlacement="bottom-start"
                            />

                            {role == '2' &&
                                <>
                                    <label>Статус заявки:</label>
                                    <Form.Select
                                        className='my-2'
                                        value={selectedStatus || ""}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="">Выберите статус</option>
                                        <option value="1">Создан</option>
                                        <option value="2">В работе</option>
                                        <option value="3">Завершён</option>
                                        <option value="4">Отклонён</option>
                                    </Form.Select>
                                </>
                            }



                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            }

            {/* =================================== TABLE ADMIN =============================================*/}
            {Flights &&
                <table className='table-Flights'>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название АМС</th>
                        <th>Дата создания заявки</th>
                        {/*<th>Логин пользователя</th>*/}
                        <th>Дата начала процесса</th>

                        <th>Результат</th>



                        <th>Статус</th>

                    </tr>
                    </thead>
                    <tbody>
                    {Flights.map((Flight) => (
                            <tr key={Flight.id} onClick={() => clickCell(Flight.id)}>
                                <td>{Flight.id}</td>
                                <td>{Flight.ams || 'Не задано'}</td>
                                <td>{checkData(Flight.date_create)}</td>
                                <td>{checkData(Flight.date_formation || 'Не сформирована')}</td>
                                <td>{Flight.result || 'пустая строка результата'}</td>
                                {/*<td>{Flight.user_login || 'Не задан'}</td>*/}
                                <td>{Flight.status}</td>
                                {/*<td>{Flight.leader || 'На задан'}</td>*/}
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