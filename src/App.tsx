import {Routes, Route, Navigate} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar.tsx";
import PlanetsList from "./components/PlanetsList/PlanetsList.tsx";
import PlanetDetail from "./components/PlanetDetail/PlanetDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {IBreadCrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";
import RequestView from "./components/RequestView/RequestView.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.tsx";
import flightCard from "./components/RequestView/FlightCard.tsx";
import FlightCard from "./components/RequestView/FlightCard.tsx";

function App() {
    const PlanetsPage = {name: 'Планеты', to: 'Planets'};
    const requestPage = {name: 'Заявка', to: 'request'};
    const [searchValue, setSearchValue] = useState('')
    const [pages, setPage] = useState<IBreadCrumb[]>([PlanetsPage])
    const addPage = (newPage: IBreadCrumb[]) => {
        setPage(newPage);
    };
    const resetSearchValue = () => {
        setSearchValue('');
    };

    return (
        <>
            <NavigationBar handleSearchValue={(value) => setSearchValue(value)}/>
            <BreadCrumbs pages={pages}/>
            <>
                <Routes>
                    <Route path="/" element={<Navigate to="Planets"/>}/>
                    <Route path="/Planets"
                           element={
                               <PlanetsList
                                   setPage={() => addPage([PlanetsPage])}
                                   searchValue={searchValue}
                                   resetSearchValue={resetSearchValue}
                               />
                           }
                    />
                    <Route path="/request"
                           element={
                               <RequestView
                                   setPage={() => addPage([requestPage])}
                               />
                           }
                    />
                    <Route path="/login"
                           element={
                               <LoginPage/>
                           }
                    />
                    <Route path="/register"
                           element={
                               <RegisterPage/>
                           }
                    />
                    <Route path="/Planets/:id" element={
                        <PlanetDetail
                            setPage={(name, id) => addPage([
                                PlanetsPage, {name: `Планета-${name}`, to: `Planets/${id}`}
                            ])}
                        />}
                    />
                    <Route path="/Flights/:flight_id" element={
                        <FlightCard setPage={
                            (name, id) => addPage([
                                {name: `Заявка: "${name}"`, to: `Flights/${id}`}
                            ])
                        }/>
                    }/>
                </Routes>
            </>
        </>
    )
}


export default App