import Layout from "../../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {setState} from "../../reducers/roomReducer";
import {useNavigate} from "react-router";
import {useEffect} from "react";
import Server from "../../services/server";
import api from "../../api";

const StartGame = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const s = new Server(dispatch);
    useEffect( () => {
        s.getRoom();
        s.getGame();
    }, []);
    return <Layout>
        <h1>room ID: {state.roomId}</h1>
        <button className={classNames(['btn', ' btn-primary', 'mb-2', 'w-100'])} onClick={async () => {
            s.getRoom();
        }}>See team members</button>
        <button className={classNames(['btn', ' btn-primary', 'mb-2', 'w-100'])} disabled={state.users.length < 2} onClick={async () => {
            const room = await api.createTeams(state.roomId);
            const { data: { team_1, team_2 } } = room;
            dispatch(setState({team_1, team_2}));
        }}>Create teams</button>

        <button className={classNames(['btn', ' btn-primary', 'mb-2', 'w-100'])} disabled={!state.team_1.length || !state.team_2.length} onClick={async () => {
            const round = await api.nextRound(state.roomId, state.gameId, 0);
            dispatch(setState({ round: round.data.round }));
            navigate('/game');
        }}>Start Game</button>
        {
            !!state.team_1.length && !!state.team_2.length ? <>
                <h2>Team 1:</h2>
                <ul className="list-group">
                    {state.team_1.map((i) => <li key={i} className="list-group-item">{i}</li>)}
                </ul>
                <h2>Team 2:</h2>
                <ul className="list-group">
                    {state.team_2.map((i) => <li key={i} className="list-group-item">{i}</li>)}
                </ul>
            </>: <>
                <h2>Team members:</h2>
                <ul className="list-group">
                    {state.users.map((i) => <li key={i} className="list-group-item">{i}</li>)}
                </ul>
            </>
        }
        {/*<pre>{JSON.stringify(state, null, 4)}</pre>*/}
    </Layout>
}

export default StartGame;