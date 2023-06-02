import Layout from "../../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {setState} from "../../reducers/roomReducer";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import api from "../../api";
import TeamsDragAndDrop from "../../components/TeamsDragAndDrop";
import Server from "../../services/server";

const StartGame = () => {
    const state = useSelector((state) => state);
    const [isDragMode, setIsDragMode] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const server = new Server();
    useEffect( () => {
        const run = async () => {
            await server.getRoom();
            await server.getGame();
        }
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <Layout>
        <h1>Room ID:</h1>
        <h3 className={'mb-4'}>{state.shortRoomId || state.roomId}</h3>

        { isDragMode ?
            <TeamsDragAndDrop onSave={() => setIsDragMode(false)} onCancel={() => setIsDragMode(false)} /> :
            <>
                <button className={classNames(['btn', ' btn-primary', 'mb-2', 'w-100'])} onClick={async () => {
                    server.getRoom();
                }}>See team members</button>
                <button className={classNames(['btn', ' btn-primary', 'mb-2', 'w-100'])} disabled={state.users.length < 4} onClick={async () => {
                    const room = await api.createTeams(state.roomId);
                    const { data: { team_1, team_2 } } = room;
                    dispatch(setState({team_1, team_2}));
                }}>Create teams</button>

                <button className={classNames(['btn', ' btn-primary', 'mb-2', 'w-100'])} disabled={!state.team_1.length || !state.team_2.length} onClick={async () => {
                    const round = await api.nextRound(state.roomId, state.gameId, 0);
                    server.ws?.send(JSON.stringify({data: 'update room'}));
                    server.ws?.send(JSON.stringify({data: 'update game'}));
                    dispatch(setState({ round: round.data.round }));
                    navigate(`${state.origin}/game`);
                }}>Start Game</button>

                {!!state.team_1.length && !!state.team_2.length && <button onClick={() => setIsDragMode(true)} className={'btn btn-primary w-100 mb-2'}>Change teams
                    order</button>}
            {
                !!state.team_1.length && !!state.team_2.length ? <>
                    <h2 className={'mt-4'}>Team 1:</h2>
                    <ul className="list-group mb-4">
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
            </>
        }
        {/*<pre>{JSON.stringify(state, null, 4)}</pre>*/}
    </Layout>
}

export default StartGame;