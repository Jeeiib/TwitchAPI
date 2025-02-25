import { Nav, Navbar } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../assets/twitchlogo.png';
import { Link } from 'react-router-dom';


function NavBar() {
  return (
    <Navbar bg="#18181B" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img src={Logo} alt="Logo Twitch" style={{ width: "50px" }} />
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/parcourir">Parcourir</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;