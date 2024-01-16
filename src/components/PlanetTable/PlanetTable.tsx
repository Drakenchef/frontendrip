import PlanetTableCell from './PlanetTableCell.tsx';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {FC, useEffect} from "react";
import {fetchPlanets} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponent.tsx";
import MyComponent from "../Popup/Popover.tsx";
import {Link} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import './PlanetTable.css'

interface PlanetTableProps {
    setPage: () => void
}

const PlanetTable: FC<PlanetTableProps> = ({setPage}) => {
    const dispatch = useAppDispatch()
    const {Planets, isLoading, error, success} = useAppSelector(state => state.PlanetReducer)
    useEffect(() => {
        setPage()
        dispatch(fetchPlanets())
    }, []);

    return (
        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <Nav className="ms-2">
                <Nav.Item>
                    <Link to="/add-Planet-2" className="btn btn-outline-primary mt-2"
                          style={{marginLeft: '80px', marginBottom: '30px'}}>
                        Добавить планету
                    </Link>
                </Nav.Item>
            </Nav>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название планеты</th>
                    {/*<th>Статус</th>*/}
                    <th>Описание</th>
                    <th>Изображение</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {Planets.map(Planet => (
                    <PlanetTableCell PlanetData={Planet}/>
                ))
                }
                </tbody>
            </table>
        </>
    );
};

export default PlanetTable;
