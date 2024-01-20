import {useState, ChangeEvent, FormEvent, FC, useEffect} from 'react';
import {Button, Form, Container, Row, Col} from 'react-bootstrap';
import {convertServerDateToInputFormat, createPlanet} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import MyComponent from "../Popup/Popover.tsx";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";
import waiting = Simulate.waiting;

interface PlanetData {
    PlanetName: string;
    description: string;
    image: File | null;
}

interface AddPlanetProps {
    setPage: () => void
}

const CreatePlanetPage: FC<AddPlanetProps> = ({setPage}) => {
    const navigate = useNavigate();
    const [PlanetData, setPlanetData] = useState<PlanetData>({
        PlanetName: '',
        description: '',
        image: null,
    });
    const {error, success} = useAppSelector(state => state.PlanetReducer)
    const role = Cookies.get('role')
    const dispatch = useAppDispatch()
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setPlanetData({...PlanetData, [name]: value});
    };

    useEffect(() => {
        setPage()
    }, []);

    const save = () => {
        dispatch(createPlanet(PlanetData.PlanetName, PlanetData.description, PlanetData.image));

        setTimeout(() => {
            navigate(-1);
        }, 150);  // 250 миллисекунд = 0.25 секунды
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            PlanetData.image = file
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Handle form submission logic, e.g., dispatching data to the server
        console.log('Planet data submitted:', PlanetData);
    };

    if (role != '2') {
        console.log(role)
        return <h2>нет прав</h2>
    }
    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <Container>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <h2>Добаление планеты</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formPlanetName">
                                <Form.Label>Название планеты</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Название"
                                    name="PlanetName"
                                    value={PlanetData.PlanetName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPlanetDescription">
                                <Form.Label>Описание планеты</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Описание"
                                    name="description"
                                    value={PlanetData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPlanetImage">
                                <Form.Label>Фотография планеты</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>

                            <button variant="primary" type="submit" style={{marginTop: '30px'}} onClick={save}>
                                Создать
                            </button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default CreatePlanetPage;
