import { Nav, Navbar } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../assets/twitchlogo.png';


function NavBar() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
          <Navbar.Brand href="HomePage"><img src={Logo} alt="Logo Twitch" style={{width : "50px"}} /></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="parcourir">Parcourir</Nav.Link>
          </Nav>
      </Navbar>
    </>
  );
}

export default NavBar;