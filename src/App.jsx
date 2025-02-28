import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Parcourir from "./pages/Parcourir";
import ParcourirDetails from './pages/ParcourirDetails';
import StreamerPage from './pages/StreamerPage';
import NavBar from './components/NavBar';



function App() {
  return (
    <>
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/parcourir" element={<Parcourir />} />
          <Route path="/parcourir/:gameId" element={<ParcourirDetails />} />
          <Route path="/streamer/:streamerName" element={<StreamerPage />} />
        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;
