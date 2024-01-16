import {useNavigate} from 'react-router-dom';
import React, {FC, useEffect} from 'react';
import {IPlanet} from "../../models/models.ts";
import List from "../List.tsx";
import PlanetItem from "../PlanetItem/PlanetItem.tsx";
import './PlanetsList.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchPlanets} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponent.tsx";
import MyComponent from "../Popup/Popover.tsx";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import {progressSlice} from "../../store/reducers/ProgressData.ts";

interface PlanetsListProps {
    setPage: () => void
}

const PlanetList: FC<PlanetsListProps> = ({setPage}) => {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputValue = (e.currentTarget.elements.namedItem('search') as HTMLInputElement)?.value;
        dispatch(progressSlice.actions.setSearch(inputValue))
    };
    const dispatch = useAppDispatch()
    const {Planets, isLoading, error, success, basketID} = useAppSelector(state => state.PlanetReducer)
    const navigate = useNavigate();
    const {searchValue} = useAppSelector(state => state.progressReducer)

    useEffect(() => {
        setPage()
        dispatch(fetchPlanets(searchValue))
    }, [searchValue]);

    const didTapBasket = () => {
        navigate(`/Flights/${basketID}`);
    }

    if (!Planets) {
        return <h3>Данных нет</h3>
    }

    return (
        <>
            {isLoading && <LoadAnimation />}
            {error != "" && <MyComponent isError={true} message={error} />}
            {success != "" && <MyComponent isError={false} message={success} />}
            <div
                className="d-flex justify-content-between align-items-center mb-3"
                style={{ padding: '0 50px' }} // добавляем отступы от краев контейнера
            >
                <Form onSubmit={handleSearch} className="d-flex" style={{ maxWidth: '250px', flex: '1' }}>
                    <FormControl
                        id={'search-text-field'}
                        type="text"
                        name="search"
                        placeholder="Поиск планет"
                        className="me-2"
                        aria-label="Search"
                    />
                    <Button type="submit" variant="outline-light">
                        Поиск
                    </Button>
                </Form>

                <Button
                    variant="primary"
                    onClick={didTapBasket}
                    disabled={basketID == 0}
                >
                    Создать заявку
                </Button>
            </div>
            <List items={Planets ?? []} renderItem={(Planet: IPlanet) =>
                <PlanetItem
                    key={Planet.id}
                    Planet={Planet}
                    isServer={true}
                    onClick={(num) => navigate(`/Planets/${num}`)}
                />
            } />
        </>
    )

};

export default PlanetList;