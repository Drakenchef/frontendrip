import {Routes, Route, Navigate} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar.tsx";
import PlanetsList from "./components/PlanetsList/PlanetList.tsx";
import PlanetDetail from "./components/PlanetDetail/PlanetDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {IBreadCrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";


function App() {
    const PlanetsPage = {name: 'Планеты', to: 'Planets'};
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
                    <Route path="/Planet/:id" element={
                        <PlanetDetail
                            setPage={(name, id) => addPage([
                                PlanetsPage, {name: `Планета-${name}`, to: `Planets/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App