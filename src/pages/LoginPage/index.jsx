import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useState,} from "react";
import css from './styles.module.scss'
import classNames from "classnames";
import api from "../../api";
import {setState} from "../../reducers/roomReducer";
import {useNavigate} from "react-router";
import Server from "../../services/server";

const LoginPage = () => {
    const [roomId, setRoomId] = useState(localStorage.getItem('shortRoomId') || localStorage.getItem('roomId'));
    const state = useSelector((state) => state);
    const server = useMemo(() => {
        return new Server();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const run = async () => {
            await server.getGame();
            await server.getRoom();
        }
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <div className={'container-md p-3'}>
        <h2 className={'mb-3 display-6'}>Decoder -<br />the best game ever!</h2>
        <div className={classNames(['form-group', 'mb-2', 'w-100'])}>
            <input type="text" className="form-control" id="userName" onChange={(e) =>{
                localStorage.setItem('userName', e.target.value);
                dispatch(setState({ me: e.target.value }));
            }}
                   placeholder="Enter your name"
                   value={state.me || ''}/>
        </div>
        <form className={css.form} onSubmit={async (e) => {
            e.preventDefault();
            roomId.length === 4 && localStorage.setItem('shortRoomId', roomId);
            const res = await server.joinRoom(roomId, state.me);
            if (!res) {
                return;
            }
            if (state.round) {
                navigate('/game');
            } else {
                state.mainUser === state.me ? navigate('/startGame') : navigate('/game');
            }
        }}>
            <div className={classNames(['form-group', 'mb-2', 'w-100'])}>
                <input
                    type="text"
                    className="form-control"
                    id="roomID"
                    aria-describedby="emailHelp"
                    onChange={
                        (e) => {
                            setRoomId(e.target.value);
                        }
                    }
                       placeholder="Enter room ID, for example: 6459811ff421a7f05fe752c0"
                    value={roomId || ''}
                />
            </div>
            <button
                type="submit"
                className={'btn btn-primary mb-2'}
                disabled={!roomId || roomId.length < 4 || !state.me}
            >
                Join
            </button>
        </form>
        <h3 className='text-center'>Or</h3>
        <button type="submit" className={classNames(['btn', ' btn-primary', 'mb-2', 'w-100'])} disabled={!state.me || roomId} onClick={async () => {
            const room = await api.newRoom(state.me);
            const { data: { _id: roomId, mainUser, users, roomId: shortRoomId }} = room;
            const game = await api.newGame(roomId);
            const { data: { _id: gameId }} = game;
            roomId && localStorage.setItem('roomId', roomId);
            state.me && localStorage.setItem('userName', state.me);
            gameId && localStorage.setItem('gameId', gameId);
            shortRoomId && localStorage.setItem('shortRoomId', shortRoomId);
            dispatch(setState({ mainUser, users, roomId, gameId, shortRoomId }));
            navigate('/StartGame')
        }}>Create new room</button>
        {/*<pre>{JSON.stringify(state, null, 4)}</pre>*/}
    </div>
}

export default LoginPage;