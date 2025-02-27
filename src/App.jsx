// src/App.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Parcourir from "./pages/Parcourir";
import ParcourirDetails from "./pages/ParcourirDetails";
import StreamerPage from "./pages/StreamerPage";
import Sidebar from "./components/SideBar";
import { SidebarProvider } from "./context/SidebarContext"; // Importer SidebarProvider

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <div style={{ display: "flex" }}>
          <Sidebar /> {/* Sidebar globale à gauche */}
          <div style={{ flex: 1, minWidth: 0 }}> {/* Contenu principal avec flex pour éviter le débordement */}
            <Navbar /> {/* Navbar en haut */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/parcourir" element={<Parcourir />} />
              <Route path="/parcourir/:gameId" element={<ParcourirDetails />} />
              <Route path="/streamer/:streamerName" element={<StreamerPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;