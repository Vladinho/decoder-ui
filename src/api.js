import axios from "axios";
import {setState} from "./reducers/roomReducer";

axios.defaults.baseURL = 'http://localhost:4444/';

// const api = {
//     getGame: (id) => axios.get('game', {
//         params: { id }
//     }),
//     getRoom: (id) => axios.get('room', {
//         params: { id }
//     }),
//     joinRoom: (id, user) => axios.post('joinRoom', {
//         id,
//         user
//     }),
//     getGameByRoomId: (id) => axios.get('gameByRoomId', {
//         params: { id }
//     }),
// }



const getApi = (dispatch = () => {}) => {
    return {
        getGame: (id) => middleWare(() => axios.get('game', {
            params: { id }
        }), dispatch),
        getRoom: (id) => middleWare(() => axios.get('room', {
            params: { id }
        }), dispatch),
        joinRoom: (id, user) => middleWare(() => axios.post('joinRoom', {
            id,
            user
        }), dispatch),
        getGameByRoomId: (id) => middleWare(() => axios.get('gameByRoomId', {
            params: { id }
        }), dispatch),
        newRoom: (user) => middleWare(() => axios.post('room', {
            user
        }), dispatch),
        newGame: (roomId) => middleWare(() => axios.post('game', {
            roomId
        }), dispatch),
        createTeams: (id) => middleWare(() => axios.post('teams', {
            id
        }), dispatch),
        nextRound: (roomId, gameId, curRound) => middleWare(() => axios.post('nextRound', {
            roomId, gameId, curRound
        }), dispatch),

        getAnswers: (gameId) => middleWare(() => axios.get('answer', {
            params: { gameId }
        }), dispatch),
    }
}

const middleWare = (callback, dispatch) => {
    dispatch(setState({ isLoading: true }));
    return callback().catch((e) => dispatch(setState({ errors: e }))).finally(() => {
        dispatch(setState({ isLoading: false }));
    })
}

export default getApi;