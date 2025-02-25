import { useState } from "react";
import "./App.css";
import twitchApi from "./services/twitchService";
import { BrowserRouter, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";


function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar />
        <Routes>
        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;
