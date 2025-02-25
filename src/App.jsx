import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Parcourir from "./pages/Parcourir";
import ParcourirDetails from './pages/ParcourirDetails';


function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/parcourir" element={<Parcourir />} />
          <Route path="/parcourir/:gameId" element={<ParcourirDetails />} />
        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;
