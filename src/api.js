import axios from "axios";

axios.defaults.baseURL = 'https://decoder90.herokuapp.com/';
// axios.defaults.baseURL = 'http://localhost:4444/';

const api = {
    getGame: (id) =>axios.get('game', {
        params: { id }
    }),
    getRoom: (id) =>axios.get('room', {
        params: { id }
    }),
    joinRoom: (id, user) => axios.post('joinRoom', {
        id,
        user
    }),
    getGameByRoomId: (id) => axios.get('gameByRoomId', {
        params: { id }
    }),
    newRoom: (user) => axios.post('room', {
        user}),
    newGame: (roomId) => axios.post('game', {
        roomId
    }),
    createTeams: (id, team_1, team_2) => axios.post('teams', {
        id,
        team_1,
        team_2
    }),
    nextRound: (roomId, gameId, curRound) => axios.post('nextRound', {
        roomId, gameId, curRound
    }),
    getAnswers: (gameId) => axios.get('answer', {
        params: { gameId }
    }),
    setAnswer: (roomId, gameId, user, code, answer) => axios.post('answer', {
        roomId, gameId, user, code, answer
    }),
    setAgree: (roomId, gameId, user, answerId) => axios.post('guess', {
        roomId, gameId, user, answerId, agree: true
    }),
    setGuess: (roomId, gameId, user, answerId, guess) => axios.post('guess', {
        roomId, gameId, user, answerId, guess
    }),
    setNextRound: (roomId, gameId, curRound) => axios.post('nextRound', {
        roomId, gameId, curRound
    }),
    setComment: (roomId, gameId, { comments_1, comments_2 }) => axios.post('comment', {
        gameId, comments_1, comments_2
    }),
    reset: (gameId, roomId) => axios.post('reset', {
        gameId, roomId
    })
}

export default api;