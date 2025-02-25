import { useState } from "react";
import "./App.css";
import twitchApi from "./services/twitchService";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Parcourir from "./pages/Parcourir";


function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/parcourir" element={<Parcourir />} />
        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;
