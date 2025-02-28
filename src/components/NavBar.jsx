import { useState } from 'react';
import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../assets/twitchlogo.png';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import mockStreamers from '../services/mockStreamers';

function NavBar() {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Fonction commune pour lancer la recherche (utilisée par clic et Entrée)
  const handleSearch = () => {
    if (searchInput.trim()) {
      const results = mockStreamers.filter((streamer) =>
        streamer.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      console.log("Résultats trouvés :", results);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  // Lancer la recherche avec la touche Entrée
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Empêche le comportement par défaut (soumission de formulaire)
      handleSearch();
    }
  };

  // Clic sur la loupe
  const handleSearchClick = () => {
    handleSearch();
  };

  // Redirection vers StreamerPage
  const handleResultClick = (streamerName) => {
    console.log("Navigation vers :", `/streamer/${streamerName}`);
    navigate(`/streamer/${streamerName}`);
    setShowResults(false);
    setSearchInput('');
  };

  return (
    <Navbar bg="#18181B" data-bs-theme="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img src={Logo} alt="Logo Twitch" style={{ width: "50px" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/parcourir">Parcourir</Nav.Link>
          </Nav>
          <div style={{ position: "relative", maxWidth: "500px", width: "100%", marginLeft: "-100px", marginRight: "auto" }}>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Rechercher un streamer..."
                className="me-2 custom-search-input"
                aria-label="Search"
                value={searchInput}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown} // Ajout de l'événement pour Entrée
                style={{
                  backgroundColor: "#2A2A2E",
                  color: "white",
                  border: "none",
                  outline: "none",
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
                className="no-hover"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} size="2xs" />
              </Button>
            </Form>
            {showResults && searchResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: "#2A2A2E",
                  borderRadius: "5px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {searchResults.map((streamer) => (
                  <div
                    key={streamer.id}
                    onClick={() => handleResultClick(streamer.name)}
                    style={{
                      padding: "10px",
                      color: "white",
                      cursor: "pointer",
                      borderBottom: "1px solid #3A3A3E",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#4B367C")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#2A2A2E")}
                  >
                    {streamer.name} ({streamer.status === "live" ? "En direct" : "Hors ligne"})
                  </div>
                ))}
              </div>
            )}
            {showResults && searchResults.length === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: "#2A2A2E",
                  borderRadius: "5px",
                  padding: "10px",
                  color: "white",
                  zIndex: 1000,
                }}
              >
                Aucun streamer trouvé
              </div>
            )}
          </div>
          <Nav>
            {/* Ajoute des liens ici si besoin */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;