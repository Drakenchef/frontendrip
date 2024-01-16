import {FC} from 'react';
import {IPlanet} from '../../models/models.ts';
import './CardItem.css'
import {addPlanetIntoFlight} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {PlanetSlice} from "../../store/reducers/PlanetSlice.ts";


interface PlanetItemProps {
    Planet: IPlanet;
    onClick: (num: number) => void,
    isServer: boolean
}

const PlanetItem: FC<PlanetItemProps> = ({Planet, onClick, isServer}) => {

    const dispatch = useAppDispatch()
    const {increase} = PlanetSlice.actions
    const {serialNumber} = useAppSelector(state => state.PlanetReducer)

    const plusClickHandler = () => {

        dispatch(increase())
        dispatch(addPlanetIntoFlight(Planet.id, serialNumber, Planet.name ?? "Без названия"))
    }

    return (
        <div className="card-Planet-item" data-Planet-id={Planet.id}>
            <img
                src={Planet.image}
                alt="Image"
                className="photo"
                onClick={() => onClick(Planet.id)}
                id={`photo-${Planet.id}`}
            />
            {isServer && (
                <div className="circle" onClick={plusClickHandler}>
                    <img
                        src="/public/plus.png"
                        alt="+"
                        className="deleted-trash"
                    />
                </div>
            )}
            <div className="container-card" onClick={() => onClick(Planet.id)}>{Planet.name}</div>
        </div>
    );
};

export default PlanetItem;