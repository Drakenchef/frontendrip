import {useNavigate} from 'react-router-dom';
import {FC, useEffect} from 'react';
import {IPlanet} from "../../models/models.ts";
import List from "../List.tsx";
import PlanetItem from "../PlanetItem/PlanetItem.tsx";
import './PlanetsList.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchPlanets} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponent.tsx";
import MyComponent from "../Popup/Popover.tsx";
import Button from "react-bootstrap/Button";

interface PlanetsListProps {
    setPage: () => void
    searchValue?: string
    resetSearchValue: () => void;
}

const PlanetsList: FC<PlanetsListProps> = ({setPage, searchValue}) => {
    const dispatch = useAppDispatch()
    const {Planets, isLoading, error, success,basketID} = useAppSelector(state => state.PlanetReducer)
    const navigate = useNavigate();

    useEffect(() => {
        setPage()
        dispatch(fetchPlanets(searchValue))
    }, [searchValue]);

    const didTapBasket = () => {
        navigate(`/Flights/${basketID}`);
    }

    return (
        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                <Button
                    variant="primary"
                    onClick={didTapBasket}
                    disabled={basketID == 0}
                    style={{position: 'absolute', right: 40}}
                >
                    Создать заявку
                </Button>
            </div>
            <List items={Planets} renderItem={(Planet: IPlanet) =>
                <PlanetItem
                    key={Planet.id}
                    Planet={Planet}
                    isServer={true}
                    onClick={(num) => navigate(`/Planets/${num}`)}
                />
            }
            />
        </>
    )
};

export default PlanetsList;