import {Link} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import React, {FC} from "react";
import './navbar.css'

interface NavigationBarProps {
    handleSearchValue: (value: string) => void
}

const NavigationBar: FC<NavigationBarProps> = ({handleSearchValue}) => {

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputValue = (e.currentTarget.elements.namedItem('search') as HTMLInputElement)?.value;
        handleSearchValue(inputValue);
    };

    return (
        <Navbar expand="sm" className='navbar' data-bs-theme="dark">
            <div className='container-xl px-2 px-sm-3'>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Item>
                            <Link to="/Planets" className="navbarlink">Планеты</Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link to="/Planets" className="navbarlink">Полёты</Link>
                        </Nav.Item>
                    </Nav>
                    <Form onSubmit={handleSearch} className="d-flex">
                        <FormControl
                            id={'search-text-field'}
                            type="text"
                            name="search"
                            placeholder="Поиск планет"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button className ="searchbtn" type="submit" variant="outline-light">Поиск</Button>
                    </Form>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default NavigationBar;