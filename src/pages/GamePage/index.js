import Layout from "../../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import getApi from "../../api";
import {setState} from "../../reducers/roomReducer";
import Server from "../../services/server";

const Game = () => {
    const state = useSelector((state) => state);
    const myTeam = state.team_1.some((i) => i === state.me) ? 1 : 2;
    const words = myTeam === 1 ? state.words_1 : state.words_2;
    const dispatch = useDispatch();
    const [inputsState, setInputsState] = useState(['', '', ''])
    let code = ''
    if (state.team_1_player === state.me) {
        code = state.team_1_code;
    }
    if (state.team_2_player === state.me) {
        code = state.team_2_code;
    }
    useEffect( () => {
        const s = new Server(dispatch);
        s.getGame();
        s.getRoom();
    }, []);
    console.log(code)
    return <Layout>
        <ul className="list-group list-group-horizontal">
            {words.map(i => <li className="list-group-item flex-grow-1 flex-shrink-1" key={i}>{i}</li>)}
        </ul>
        {code && <h1 className='m-2'>Code: {code}</h1>}
        {state.team_2_player === state.me && <h1 className='m-2'>Code: {state.team_2_code}</h1>}
        {
            code && <form>
                {
                    code.split('').map((i, index) => <div className="form-group mb-2" key={i}>
                        <label htmlFor={`word${i}`}>{state.myTeam === 1 ? state.words_1[+i - 1] : state.words_2[+i - 1]}</label>
                        <input
                            type="text"
                            className="form-control"
                            id={`word${i}`}
                            placeholder='Enter your word'
                            value={inputsState[i - 1]}
                            onChange={(e) =>
                                setInputsState((s) => {
                                const inputs = [...s];
                                inputs[index] = e.target.value;
                                return inputs;
                        })}/>
                    </div>)
                }
                <button type="submit" className="btn btn-primary" disabled={inputsState.some(i => !i)}>Submit</button>
            </form>
        }
        <pre>{JSON.stringify(state, null, 4)}</pre>
    </Layout>
}

export default Game;