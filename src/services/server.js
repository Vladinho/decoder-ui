import {setState} from "../reducers/roomReducer";
import api from "../api";
import store from "../store";

class Server {
    constructor() {
        this.dispatch = store.dispatch;
        this.getState = store.getState;
        this.gameId = localStorage.getItem('gameId');
        this.roomId = localStorage.getItem('roomId');
        this.user = localStorage.getItem('userName');
    }
    startLoading = () => {
        this.dispatch(setState({ isLoading: true }));
    }
    stopLoading = () => {
        this.dispatch(setState({ isLoading: false }));
    }
    getGame = async (roomId = this.roomId) => {
        if (!roomId) {
            console.log('no id for getGameByRoomId');
            return;
        }
        this.startLoading();
        try {
            const game = await api.getGameByRoomId(roomId);
            const { data: { round, team_1_code, team_2_code, words_1, words_2, comments_1, comments_2, team_1_player, team_2_player, _id } } = game;
            localStorage.setItem('gameId', _id);
            const data = { round, team_1_code, team_2_code, words_1, words_2, comments_1, comments_2, team_1_player, team_2_player }
            this.dispatch(setState(data));
            return data;
        } catch (e) {
            this.dispatch(setState({ errors: e }));
        } finally {
            this.stopLoading();
        }

    };
    getRoom = async (id = this.roomId) => {
        if (!id) {
            console.log('no id for getRoom');
            return;
        }
        this.startLoading();
        try {
            const room = await api.getRoom(id);
            const me = this.getState().me;
            const { data: { users, team_1, team_2, mainUser } } = room;
            const data = { users, team_1, team_2, mainUser, myTeam: team_1.some(i => i === me) ? 1 : 2, opponentTeam: team_1.some(i => i === me) ? 2 : 1 };
            this.dispatch(setState(data));
            return data;
        } catch (e) {
            this.dispatch(setState({ errors: e }));
        } finally {
            this.stopLoading();
        }

    };
    getAnswers = async (id = this.gameId) => {
        if (!id) {
            console.log('no id for getAnswers');
            return;
        }
        this.startLoading();
        try {
            const answers = await api.getAnswers(id);
            this.dispatch(setState({ answers: answers.data }));
        } catch (e) {
            this.dispatch(setState({ errors: e }));
        } finally {
            this.stopLoading();
        }
    }
    setAnswer = async (code, answer) => {
        this.startLoading();
        try {
            const { data: { team_1_code, team_2_code, team_1_player, team_2_player } } = await api.setAnswer(this.roomId, this.gameId, this.user, code, answer);
            await this.getAnswers();
            // const answers = this.getState().answers;

            const newState = { team_1_code, team_2_code, team_1_player, team_2_player }
            Object.keys(newState).forEach(key => {
                if (newState[key] === undefined) {
                    delete newState[key];
                }
            })
            this.dispatch(setState({ ...newState }));
        } catch (e) {
            this.dispatch(setState({ errors: e }));
        } finally {
            this.stopLoading();
        }

        // console.log(data);
        // console.log(this.getState().answers)
        // this.dispatch(setState());
        // const { data: {} } = answers
    }

    createTeams = async () => {
        this.startLoading();
        try {
            const me = this.getState().me;
            const room = await api.createTeams(this.roomId);
            const { data: { team_1, team_2 } } = room;
            this.dispatch(setState({ team_1, team_2, myTeam: team_1.some(i => i === me) ? 1 : 2 }));
        } catch (e) {
            this.dispatch(setState({ errors: e }));
        } finally {
            this.stopLoading();
        }
    }
    agree = async (answerId) => {
        this.startLoading();
        try {
            await api.setAgree(this.roomId, this.gameId, this.user, answerId);
            this.getAnswers();
        } catch (e) {
            this.dispatch(setState({ errors: e }));
        } finally {
            this.stopLoading();
        }
    }
    guess = async (answerId, guess) => {
        this.startLoading();
        try {
            await api.setGuess(this.roomId, this.gameId, this.user, answerId, guess);
            this.getAnswers();
        } catch (e) {
            this.dispatch(setState({ errors: e }));
        } finally {
            this.stopLoading();
        }
    }

    nextRound = async () => {
        this.startLoading();
        try {
            const curRound = this.getState().round;
            await api.setNextRound(this.roomId, this.gameId, curRound);
            this.getGame();
        } catch (e) {
            this.dispatch(setState({ errors: e }));
        } finally {
            this.stopLoading();
        }
    }
}

export default Server;