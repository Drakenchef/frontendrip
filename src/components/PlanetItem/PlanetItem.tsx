import {FC} from 'react';
import {IPlanet} from '../../models/models.ts';
import './CardItem.css'


interface PlanetItemProps {
    Planet: IPlanet;
    onClick: (num: number) => void,
    isServer: boolean
    reloadPage: () => void
}

const PlanetItem: FC<PlanetItemProps> = ({Planet, onClick, isServer, reloadPage}) => {
    const deleteClickHandler = () => {
        DeleteData()
            .then(() => {
                console.log(`Planet with ID ${Planet.id} successfully deleted.`);
            })
            .catch(error => {
                alert(`Failed to delete Planet with ID ${Planet.id}: ${error}`)
            });
    }

    const DeleteData = async () => {
        const response = await fetch('http://localhost:8888/Planets' + Planet.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            reloadPage()
            return
        }
        throw new Error(`status code = ${response.status}`);
    }

    return (
        <div className="card-Planet-item" data-Planet-id={Planet.id}>
            <img
                src={Planet.image}
                alt="Image"
                onError={({currentTarget}) => {currentTarget.onerror = null;
                    currentTarget.src="https://Drakenchef.github.io/frontendrip/"}}
                className="photo"
                onClick={() => onClick(Planet.id)}
                id={`photo-${Planet.id}`}
            />
            {isServer && (
                <div className="circle" onClick={deleteClickHandler}>
                    <img
                        src="/deleteTrash.png"
                        alt="Del"
                        className="deleted-trash"
                    />
                </div>
            )}
            <div className="container-card" onClick={() => onClick(Planet.id)}>{Planet.name}</div>
        </div>
    );
};
// asdasdasddfsdfasdsadasd
export default PlanetItem;