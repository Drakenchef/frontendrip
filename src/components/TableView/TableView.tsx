import {FC} from "react";
import './TableView.css'
import {IFlight, IPlanetRequests} from "../../models/models.ts";
import {useAppDispatch} from "../../hooks/redux.ts";
import {deleteFlightById} from "../../store/reducers/ActionCreator.ts";
import {PlanetSlice} from "../../store/reducers/PlanetSlice.ts";
import planetItem from "../PlanetItem/PlanetItem.tsx";

interface TableViewProps {
    status: string
    planets_request: IPlanetRequests[]
}

const TableView: FC<TableViewProps> = ({planets_request, status}) => {
    const dispatch = useAppDispatch()
    const {minus} = PlanetSlice.actions

    const handleDelete = (planet_id: number,fr_id:number) => {
        dispatch(minus())
        dispatch(deleteFlightById(planet_id,fr_id))
    }

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th className="number">Номер</th>
                    <th>Фотография</th>
                    <th>Название планеты</th>
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
                            status != "удалён" && <td className="delete-td">
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
