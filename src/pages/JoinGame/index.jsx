import Layout from "../../components/Layout";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {setState} from "../../reducers/roomReducer";
import getApi from "../../api";
import {useNavigate} from "react-router";
import emptyImg from './../../assets/empty.gif';

const JoinGame = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log(state);
    return <Layout>
        <button className={classNames(['btn', ' btn-primary', 'mb-2'])} onClick={async () => {
            console.log('state.roomId', state.roomId)
            const game = await getApi(dispatch).getGameByRoomId(state.roomId);
             const room = await getApi(dispatch).getRoom(state.roomId);
            const { data: { mainUser, team_1, team_2, users } } = room;
            const { data: {round, team_1_code, team_2_code, team_1_player, team_2_player, words_1, words_2, comments_1, comments_2, _id: gameId} } = game;
            gameId && localStorage.setItem('gameId', gameId);
            console.log(game, room)
            dispatch(setState({
                round,
                gameId,
                team_1_code,
                team_2_code,
                team_1_player,
                team_2_player,
                words_1,
                words_2,
                comments_1,
                comments_2,
                mainUser,
                team_1,
                team_2,
                users
            }))
            if (round > 0) {
                navigate('/game');
            }
        }}>Enter the game</button>
        {state.round === 0 && <>
            <h1 className={'mb-2'}>The game has`t been started yet. Please, wait.</h1>
            <img className={'w-100'} src={emptyImg}/>
        </>}
    </Layout>
}

export default JoinGame;