import './App.css';
import api from "./api";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Loader from "./components/Loader";
import JoinGame from "./pages/JoinGame";
import StartGame from "./pages/StartGamePage";
import Game from "./pages/GamePage";
import Server from "./services/server";

function App() {
    const state = useSelector((state) => state);
    // const dispatch = useDispatch();
    // useEffect(async () => {
    //     const s = new Server(dispatch);
    //     s.getGame();
    // }, []);
  return (
      <>
          {state.isLoading && <Loader />}
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/joinGame" element={<JoinGame />} />
                  <Route path="/startGame" element={<StartGame />} />
                  <Route path="/game" element={<Game />} />
              </Routes>
          </BrowserRouter>
      </>

  );
}

export default App;
