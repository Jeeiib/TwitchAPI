
import "./App.css";
import twitchApi from "./services/twitchService";
import { BrowserRouter, Routes } from "react-router-dom";


function App() {
  return (
    <>
      <BrowserRouter>
        <Route exact path="/" componant={Navbar}> 
        </Route>
      </BrowserRouter>
      
    </>
  );
}

export default App;
