import {Routes, Route} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";
import PlanetList from "./components/PlanetsList/PlanetList.tsx";
import PlanetDetail from "./components/PlanetDetail/PlanetDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {Breadcrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";
import RequestView from "./components/RequestView/RequestView.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.tsx";
import PlanetTable from "./components/PlanetTable/PlanetTable.tsx";
import CreatePlanetPage from "./components/TableView/AddPlanet.tsx";
import FlightCard from "./components/RequestView/FlightCard.tsx";
import Menu from "./components/Menu/Menu.tsx";

function App() {
    const homePage: Breadcrumb = {name: 'Главная', to: '/Planets'};
    const addPlanetPage: Breadcrumb = {name: 'Создание планеты', to: 'add-planet'};
    const PlanetsTablePage: Breadcrumb = {name: 'Таблица планет', to: 'Planets/admin'};
    const PlanetsPage: Breadcrumb = {name: 'Планеты', to: 'Planets'};
    const requestPage: Breadcrumb = {name: 'Полёты', to: 'request'};
    const [pages, setPage] = useState<Breadcrumb[]>([PlanetsPage])
    const addPage = (newPage: Breadcrumb[]) => {
        setPage(newPage);
    };
//commit
    return (
        <>
            <NavigationBar/>
            <BreadCrumbs paths={pages}/>
            <>
                <Routes>

                    {/*<Route path="/" element={*/}
                    {/*    <Menu*/}
                    {/*        setPage={() => addPage([homePage])}*/}
                    {/*    />*/}
                    {/*}/>*/}

                    <Route path="/Planets" element={
                        <PlanetList
                            setPage={() => addPage([homePage, PlanetsPage])}
                        />
                    }
                    />

                    <Route path="/request" element={
                        <RequestView
                            setPage={() => addPage([homePage, requestPage])}
                        />
                    }
                    />

                    <Route path="/add-Planet" element={
                        <CreatePlanetPage
                            setPage={() => addPage([homePage, addPlanetPage])}
                        />}
                    />

                    <Route path="/add-Planet-2" element={
                        <CreatePlanetPage
                            setPage={() => addPage([homePage, PlanetsTablePage, addPlanetPage])}
                        />}
                    />

                    <Route path="/login" element={<LoginPage/>}/>

                    <Route path="/Planets/admin" element={
                        <PlanetTable
                            setPage={() => addPage([homePage, PlanetsTablePage])}
                        />}
                    />

                    <Route path="/register" element={<RegisterPage/>}/>

                    <Route path="/Flights/:Flight_id" element={
                        <FlightCard setPage={
                            (name, id) => addPage([
                                homePage,
                                requestPage,
                                {name: `Полёт "${name}"`, to: `Flight/${id}`}
                            ])
                        }/>
                    }/>

                    <Route path="/Planets/:id" element={
                        <PlanetDetail
                            setPage={(name, id) => addPage([
                                homePage,
                                PlanetsPage,
                                {name: `${name}`, to: `Planets/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App
