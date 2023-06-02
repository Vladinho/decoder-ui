import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import {useDispatch, useSelector} from "react-redux";
import Loader from "./components/Loader";
import StartGame from "./pages/StartGamePage";
import Game from "./pages/GamePage";
import Modal from "./components/Modal";
import { setState } from "./reducers/roomReducer";
import { ContextProvider } from '@epam/uui-core';
import { createBrowserHistory } from "history";
import useDebounce from "./hooks/useDebounce";

function App() {
    const history = createBrowserHistory();
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const isLoading = useDebounce(state.isLoading, 200);
  return (
      <ContextProvider
          onInitCompleted={() => {}}
          history={ history }
      >
          {isLoading && <Loader />}
          <BrowserRouter>
              <Routes>
                  <Route path={`${state.origin}/`} element={<LoginPage />} />
                  <Route path={`${state.origin}/startGame`} element={<StartGame />} />
                  <Route path={`${state.origin}/game`} element={<Game />} />
              </Routes>
          </BrowserRouter>
          {state.modalCallback && <Modal callback={state.modalCallback} /> }
          {!!state.errors?.length && <Modal
              text={`${state.errors[0]?.message}\n${state.errors[0]?.response?.data?.message}` || 'Something went wrong!'}
              callback={() => dispatch(setState({ errors: [] }))}
              noAction={true}
          /> }
      </ContextProvider>

  );
}

export default App;
