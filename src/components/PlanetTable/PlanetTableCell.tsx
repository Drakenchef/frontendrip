import React, {FC, useState} from 'react';
import {Button, Form, Col} from 'react-bootstrap';
import {IPlanet} from "../../models/models.ts";
import {deletePlanet, updatePlanetImage, updatePlanetInfo} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch} from "../../hooks/redux.ts";

interface PlanetTableCellProps {
    PlanetData: IPlanet
}

const PlanetTableCell: FC<PlanetTableCellProps> = ({PlanetData}) => {
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(PlanetData.name ?? "");
    const [description, setDescription] = useState(PlanetData.description ?? "");
    const [status, setStatus] = useState(PlanetData.status);
    const [statusId, setStatusId] = useState(`${PlanetData.status}`);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleDeleteClick = () => {
        dispatch(deletePlanet(PlanetData.id))
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        dispatch(updatePlanetInfo(PlanetData.id, name, description))
        if (imageFile) {
            dispatch(updatePlanetImage(PlanetData.id, imageFile))
        }
        setIsEditing(false);
    };

    const handleInputChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setDescription(value)
    }

    const handleInputChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setName(value)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {value} = e.target;
        setStatus(value)

    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    if (isEditing) {
        return <td colSpan={6}>
            <div>
                <Form className='mx-5'>
                    <Form.Group as={Col} controlId="formPlanetName" className='mt-2'>
                        <Form.Label>Название планеты</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите название планеты"
                            name="name"
                            value={name}
                            onChange={handleInputChangeName}
                        />
                    </Form.Group>

                    {/*<Form.Group as={Col} controlId="formPlanetStatus" className='mt-2'>*/}
                    {/*    <Form.Label>Статус</Form.Label>*/}
                    {/*    <Form.Control*/}
                    {/*        as="select"*/}
                    {/*        name="status"*/}
                    {/*        value={status}*/}
                    {/*        onChange={handleInputChange}*/}
                    {/*    >*/}
                    {/*        <option value="0">Существует</option>*/}
                    {/*        <option value="1">Удален</option>*/}
                    {/*    </Form.Control>*/}
                    {/*</Form.Group>*/}

                    <Form.Group controlId="formPlanetDescription" className='mt-2'>
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Введите описание планеты"
                            name="description"
                            value={description}
                            onChange={handleInputChangeDescription}
                        />
                    </Form.Group>

                    {/*<Form.Group controlId="formPlanetImage" className='mt-2'>*/}
                    {/*    <Form.Label>Картинка</Form.Label>*/}
                    {/*    <Form.Control*/}
                    {/*        type="file"*/}
                    {/*        accept="image/*"*/}
                    {/*        onChange={handleImageChange}*/}
                    {/*    />*/}
                    {/*</Form.Group>*/}

                    <div style={{display: 'flex', justifyContent: 'space-between'}} className='my-3'>
                        <button variant="primary" onClick={handleSaveClick}>
                            Сохранить изменения
                        </button>

                        <Button variant='outline-light' onClick={() => {
                            setIsEditing(false)
                        }}>
                            Отменить редактирование
                        </Button>
                    </div>
                </Form>
            </div>
        </td>
    }

    return (
        <>
            <tr key={PlanetData.id}>
                <td>{PlanetData.id}</td>
                <td>{PlanetData.name}</td>
                {/*<td>{PlanetData.status}</td>*/}
                <td>{PlanetData.description}</td>
                <td>{PlanetData.image &&
                    <img src={PlanetData.image}
                         alt="Planet Image"
                         className="img-thumbnail"
                         style={{width: '200px'}}/>
                }</td>
                <div className='my-3' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Button variant="outline-warning" onClick={handleEditClick} className='mb-2'>
                        Редактировать
                    </Button>

                    <Button variant="outline-danger" onClick={handleDeleteClick} style={{width: '100%'}}>
                        Удалить
                    </Button>
                </div>
            </tr>
        </>
    )
};

export default PlanetTableCell;
