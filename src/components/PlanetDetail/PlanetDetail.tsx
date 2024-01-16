import {FC, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './PlanetCard.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchPlanet} from "../../store/reducers/ActionCreator.ts";

interface PlanetDetailProps {
    setPage: (name: string, id: number) => void
}

const PlanetDetail: FC<PlanetDetailProps> = ({setPage}) => {
    const params = useParams();
    const dispatch = useAppDispatch()
    const {Planet, isLoading, error} = useAppSelector(state => state.PlanetReducer)
    const navigate = useNavigate();

    const handleDelete = () => {
        navigate('/Planets');
        DeleteData()
            .then(() => {
                console.log(`Planet with ID ${Planet?.id} successfully deleted.`);
            })
            .catch(error => {
                console.error(`Failed to delete Planet with ID ${Planet?.id}: ${error}`);
                navigate('/Planets');
            });
    }

    const DeleteData = async () => {
        try {
            const response = await fetch('http://localhost:8888/api/Planets/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',

                },

            });

            if (response.status === 200) {
                console.log('Планета успешно удалена');
                window.location.reload();
            } else {
                console.error('Произошла ошибка при удалении планеты');
            }

        } catch (error) {
            console.error('Произошла ошибка сети', error);
        }
    }

    const BackHandler = () => {
        navigate('/Planets');
    }

    useEffect(() => {
        dispatch(fetchPlanet(`${params.id}`, setPage))
    }, [params.id]);

    return (
        <>
            {isLoading && <h1> Загрузка данных .... </h1>}
            {error && <h1>Ошибка {error} </h1>}
            {<div className="Planet-card-body">
                <div className="card-container">
                    <span className="pro">Планета</span>
                    <img
                        className="round"
                        src={Planet?.image}
                        alt={Planet?.name}
                    />
                    <h3>{Planet?.name}</h3>
                    {/*<h6>Статус: {Planet?.status.status_name}</h6>*/}
                    <p>{Planet?.description}</p>
                    {/*<img*/}
                    {/*    className="delete-button"*/}
                    {/*    src="/deleteTrash.png"*/}
                    {/*    alt="Delete"*/}
                    {/*    onClick={handleDelete}*/}
                    {/*/>*/}
                    <div className="buttons">
                        <button className="primary" onClick={BackHandler}>Назад</button>
                        {/*<button className="primary ghost">Записаться</button>*/}
                    </div>
                </div>
            </div>}
        </>
    );
};

export default PlanetDetail;