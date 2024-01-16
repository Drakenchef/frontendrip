import {FC} from "react";
import './TableView.css'
import { IPlanetRequests} from "../../models/models.ts";
import {useAppDispatch} from "../../hooks/redux.ts";
import {deleteFlightById} from "../../store/reducers/ActionCreator.ts";
import {PlanetSlice} from "../../store/reducers/PlanetSlice.ts";
import {useNavigate} from "react-router-dom";

interface TableViewProps {
    status: string
    planets_request: IPlanetRequests[]
}
//asdasddasdasdasd
const TableView: FC<TableViewProps> = ({planets_request, status}) => {
    const dispatch = useAppDispatch()
    const {minus} = PlanetSlice.actions
    const navigate = useNavigate();

//asdasdasdads
    const handleDelete = async (planet_id: number, fr_id:number) => {
        dispatch(minus());
        await dispatch(deleteFlightById(planet_id, fr_id));
        navigate(-1)
        // Здесь await убедится, что запрос fetchFlights() выполнится после удаления
    };


    return (
        <>
            <table>
                <thead>
                <tr>
                    <th className="number">Номер</th>
                    <th>Фотография</th>
                    <th>Название АМС</th>
                    <th>Описание</th>
                </tr>
                </thead>
                <tbody>
                {planets_request.map((item, index) => (
                    <tr key={index}>
                        <td className="Planet-number-td">{item.planet_id}</td>
                        <td className="image-td">
                            <img src={item.planet.image} alt="photo"/>
                        </td>
                        <td className="Planet-name-td">{item.planet.name}</td>
                        <td>{item.planet.description}</td>
                        {
                            status != "отклонен" && status != "удален" && status != "отменен" && status != "завершен" && <td className="delete-td">
                                <img
                                    className="delete-button-td"
                                    src="/dustbin.png"
                                    alt="Delete"
                                    onClick={() => handleDelete(item.planet_id, item.fr_id)}
                                />
                            </td>
                        }
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default TableView;