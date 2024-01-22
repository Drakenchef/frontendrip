// import {useNavigate} from 'react-router-dom';
import {FC, useEffect, useState} from 'react';
import {IPlanet, mockPlanets} from "../../models/models.ts";
import List from "../List.tsx";
import PlanetItem from "../PlanetItem/PlanetItem.tsx";
import './PlanetList.css'
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {useNavigate} from "react-router-dom";

interface PlanetsListProps {
    setPage: () => void
    searchValue?: string
    resetSearchValue: () => void;
    handleSearchValue: (value: string) => void
}
let globalsearchvalue = ''
const PlanetsList: FC<PlanetsListProps> = ({setPage, searchValue, resetSearchValue, handleSearchValue}) => {
    const [Planets, setPlanets] = useState<IPlanet[]>([]);
    const [serverIsWork, setServerStatus] = useState<boolean>(false);
    const [reloadPage, setReloadPage] = useState<boolean>(false);
    // const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const inputValue = (e.currentTarget.elements.namedItem('search') as HTMLInputElement)?.value;
    //     handleSearchValue(inputValue);
    // };
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(searchText)
        // const inputValue = (e.currentTarget.elements.namedItem('search') as HTMLInputElement)?.value;
        handleSearchValue(searchText);
        globalsearchvalue = searchText ?? ''
    }
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState(globalsearchvalue)
    // const [searchText, setSearchText] = useState(searchValue)


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
        <>
        {/*<Form onSubmit={handleSearch} className="d-flex">*/}
        {/*    <FormControl*/}
        {/*        id={'search-text-field'}*/}
        {/*        type="text"*/}
        {/*        name="search"*/}
        {/*        placeholder="Поиск планет"*/}
        {/*        className="me-2"*/}
        {/*        aria-label="Search"*/}
        {/*    />*/}
        {/*    <Button className ="searchbtn" type="submit" variant="outline-light">Поиск</Button>*/}
        {/*</Form>*/}
            <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
                <Form.Control
                    type="text"
                    placeholder="Поиск"
                    className="form-control-sm flex-grow-1 shadow shadow-sm"
                    data-bs-theme="dark"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    className="shadow"
                >
                    Поиск
                </Button>
            </Form>

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
        </>
    );
};

export default PlanetsList;