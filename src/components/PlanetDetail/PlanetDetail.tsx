import {FC, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {IPlanet, mockPlanets} from '../../models/models.ts';
import './PlanetCard.css'

interface PlanetDetailProps {
    setPage: (name: string, id: number) => void
}

const PlanetDetail: FC<PlanetDetailProps> = ({setPage}) => {
    const params = useParams();
    const [Planet, setPlanet] = useState<IPlanet | null>(null);
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
            const response = await fetch('http://localhost:8888/Planets' , {
                method: 'DELETE',
                headers: {
                    // Сделать чтобы в джейсоне передавался айди  Planet?.id
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
        fetchPlanet()
            .catch((err) => {
                console.error(err);
                const previewID = params.id !== undefined ? parseInt(params.id, 10) - 1 : 0;
                const mockPlanet = mockPlanets[previewID]
                if (mockPlanet) {
                    setPage(mockPlanet.name ?? "Без названия", mockPlanet.id)
                }
                setPlanet(mockPlanet);
            });

    }, [params.id]);

    async function fetchPlanet() {
        try {
            const response = await fetch(`http://localhost:8888/Planet/${params.id}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // Исправление здесь:
            // if (data && data.Planets) {
            setPage(data.Planets.name ?? "Без названия", data.Planets.id);
            setPlanet(data.Planets);
            // } else {
            // Сюда попадаем, если поле Planets отсутствует в ответе
            // console.error("Проблема в структуре ответа API: отсутствует поле 'Planets'.", data);
            // }
        } catch (error) {
            console.error('Error fetching Planet data', error);
            throw error;
        }
    }


    if (!Planet) {
        return <div>Loading...</div>;
    }

    return (
        !Planet
            ? <div>Loading...</div>
            : <div className="Planet-card-body">
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
                    <img
                        className="delete-button"
                        src="/deleteTrash.png"
                        alt="Delete"
                        onClick={handleDelete}
                    />
                    <div className="buttons">
                        <button className="primary" onClick={BackHandler}>Назад</button>
                        <button className="primary ghost">Оставить заявку</button>
                    </div>
                </div>
            </div>
    );
};

export default PlanetDetail;