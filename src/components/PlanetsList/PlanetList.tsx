import {useNavigate} from 'react-router-dom';
import {FC, useEffect, useState} from 'react';
import {IPlanet, mockPlanets} from "../../models/models.ts";
import List from "../List.tsx";
import PlanetItem from "../PlanetItem/PlanetItem.tsx";
import './PlanetList.css'

interface PlanetsListProps {
    setPage: () => void
    searchValue?: string
    resetSearchValue: () => void;
}

const PlanetsList: FC<PlanetsListProps> = ({setPage, searchValue, resetSearchValue}) => {
    const [Planets, setPlanets] = useState<IPlanet[]>([]);
    const [serverIsWork, setServerStatus] = useState<boolean>(false);
    const [reloadPage, setReloadPage] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        setPage()
        fetchPlanets()
            .catch((err) => {
                console.log(err)
                filterMockData()
            });
    }, [searchValue, reloadPage]);

    const fetchPlanets = async () => {
        const url = '/api/Planets' + `?search=${searchValue ?? ''}`;

        const response = await fetch(url, {
            method: "GET",
            signal: AbortSignal.timeout(1000)
        })

        if (!response.ok) {
            setServerStatus(false)
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setServerStatus(true)
        if (data.Planets == null) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.getElementById('search-text-field').value = ""
            alert("Данных нету")
            resetSearchValue()
        }
        setPlanets(data.Planets ?? []);
    }

    const filterMockData = () => {
        if (searchValue) {
            const filteredPlanets = mockPlanets.filter(planet =>
                planet.name?.toLowerCase().includes((searchValue ?? '').toLowerCase())
            );
            if (filteredPlanets.length === 0) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                document.getElementById('search-text-field').value = ""
                alert("Данных нету")
                resetSearchValue()
            }
            setPlanets(filteredPlanets);
        } else {
            setPlanets(mockPlanets);
        }
    }

    return (
        <List items={Planets} renderItem={(Planet: IPlanet) =>
            <PlanetItem
                key={Planet.id}
                Planet={Planet}
                isServer={serverIsWork}
                onClick={(num) => navigate(`/Planet/${num}`)}
                reloadPage={() => {
                    setReloadPage(true)
                }}
            />
        }
        />
    );
};

export default PlanetsList;