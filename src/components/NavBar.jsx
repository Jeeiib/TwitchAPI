import { useState } from 'react'; // Ajout de useState
import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../assets/twitchlogo.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function NavBar({ onSearch }) {
  const [searchInput, setSearchInput] = useState(''); // État pour la saisie

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value); // Met à jour la saisie sans déclencher la recherche
  };

  const handleSearchClick = () => {
    // Déclenche la recherche uniquement au clic
    if (searchInput.trim()) {
      onSearch({ label: searchInput, value: searchInput, type: "search" });
    }
  };

  return (
    <Navbar bg="#18181B" data-bs-theme="dark" expand="lg">
      <Container fluid>
        {/* Logo et lien à gauche */}
        <Navbar.Brand as={Link} to="/">
          <img src={Logo} alt="Logo Twitch" style={{ width: "50px" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/parcourir">Parcourir</Nav.Link>
          </Nav>
          {/* Barre de recherche centrée avec bouton à droite */}
          <Form className="d-flex  mt-4" style={{ width: "400px", marginLeft: "-100px", marginRight: "auto"}}>
            <FormControl
              type="search"
              placeholder="Rechercher un jeu..."
              className="me-2"
              aria-label="Search"
              value={searchInput}
              onChange={handleSearchChange}
              style={{
                backgroundColor: "#2A2A2E",
                color: "white",
                border: "none",
              }}
            />
            <Button
              onClick={handleSearchClick}
              style={{
                backgroundColor: "#9147FF",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 10px",
              }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" />
            </Button>
          </Form>
          {/* Espace pour éléments à droite */}
          <Nav>
            {/* Ajoute des liens ici si besoin */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;