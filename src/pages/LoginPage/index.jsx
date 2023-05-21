import Layout from "../../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import css from './styles.module.scss'
import classNames from "classnames";
import api from "../../api";
import {setState} from "../../reducers/roomReducer";
// import getApi from "../../api";
import {useNavigate} from "react-router";
import Server from "../../services/server";

const LoginPage = () => {
    const [roomId, setRoomId] = useState(localStorage.getItem('roomId') || '');
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const state = useSelector((state) => state);
    const server = new Server();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const s = new Server(dispatch);
        s.getGame();
        s.getRoom();
    }, []);
    return <Layout>
        <h2 className={'mb-3 display-6'}>Decoder -<br />the best game ever!</h2>
        <div className={classNames(['form-group', 'mb-2', 'w-100'])}>
            <input type="text" className="form-control" id="userName" onChange={(e) => setUserName(e.target.value)}
                   placeholder="Enter your name" value={userName}/>
        </div>
        <form className={css.form} onSubmit={async (e) => {
            e.preventDefault();
            roomId && localStorage.setItem('roomId', roomId);
            userName && localStorage.setItem('userName', userName);
            dispatch(setState({ roomId, me: userName }));
            const res = await server.joinRoom(roomId, userName);
            if (!res) {
                return;
            }
            if (state.round) {
                navigate('/game');
            } else {
                state.mainUser === userName ? navigate('/startGame') : navigate('/joinGame');
            }
        }}>
            <div className={classNames(['form-group', 'mb-2', 'w-100'])}>
                <input type="text" className="form-control" id="roomID" aria-describedby="emailHelp" onChange={(e) => setRoomId(e.target.value)}
                       placeholder="Enter room ID, for example: 6459811ff421a7f05fe752c0" value={roomId}/>
            </div>
            <button type="submit" className={classNames(['btn', ' btn-primary', 'mb-2'])} disabled={!roomId || roomId.length < 24 || !userName}>Join</button>
        </form>
        <h3 className='text-center'>Or</h3>
        <button type="submit" className={classNames(['btn', ' btn-primary', 'mb-2', 'w-100'])} disabled={!userName || roomId} onClick={async () => {
            const room = await api.newRoom(userName);
            const { data: { _id: roomId, mainUser, users }} = room;
            const game = await api.newGame(roomId);
            const { data: { _id: gameId }} = game;
            roomId && localStorage.setItem('roomId', roomId);
            userName && localStorage.setItem('userName', userName);
            gameId && localStorage.setItem('gameId', gameId);
            dispatch(setState({ mainUser, users, roomId, gameId }));
            navigate('/StartGame')
        }}>Create new room</button>
        {/*<pre>{JSON.stringify(state, null, 4)}</pre>*/}
    </Layout>
}

export default LoginPage;