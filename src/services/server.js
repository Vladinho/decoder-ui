import {getInitialState, setState} from "../reducers/roomReducer";
import api from "../api";
import store from "../store";
import debounce from "../utils/debounce";
import Ws from "./ws";

class Server {
    constructor() {
        if (!Server._instance) {
            this.updateData();
            this.wss = new Ws(this.roomId, this.gameId, this.onWebSocketMessage);
            window.wss = this.wss;
            Server._instance = this;
        }

        Server._instance.updateData();
        return Server._instance;
    }
    updateData = () => {
        this.dispatch = store.dispatch;
        this.getState = store.getState;
        this.gameId = localStorage.getItem('gameId');
        this.roomId = localStorage.getItem('roomId');
        this.user = localStorage.getItem('userName');
    }

    onWebSocketMessage = (msg) => {
        switch (msg) {
            case 'update answers':
                return this.getAnswers(false);
            case 'update game':
                return this.getGame(false);
            case 'update room':
                return this.getRoom(false);
            case 'Hello!':
                return;
            default:
                console.error(`No websocket msg handler! (${msg})`)
        }
    }
    startLoading = () => {
        this.dispatch(setState({ isLoading: true }));
    }
    stopLoading = () => {
        this.dispatch(setState({ isLoading: false }));
    }
    getGame = debounce(async (withLoader = true) => {
        if (!this.roomId) {
            console.log('no id for getGameByRoomId');
            return;
        }
        withLoader && this.startLoading();
        try {
            const game = await api.getGameByRoomId(this.roomId);
            const { data: { round, team_1_code, team_2_code, words_1, words_2, comments_1, comments_2, team_1_player, team_2_player, _id } } = game;
            localStorage.setItem('gameId', _id);
            const data = { round, team_1_code, team_2_code, words_1, words_2, comments_1, comments_2, team_1_player, team_2_player }
            this.dispatch(setState(data));
            this.gameId = _id;
            return data;
        } catch (e) {
            this.dispatch(setState({ errors: e }));
        } finally {
            withLoader && this.stopLoading();
        }

    });
    getRoom = debounce(async (withLoader = true) => {
        if (!this.roomId) {
            console.log('no id for getRoom');
            return;
        }
        withLoader && this.startLoading();
        try {
            const room = await api.getRoom(this.roomId);
            const me = localStorage.getItem('userName');
            const { users = [], team_1 = [], team_2 = [], mainUser = null } = room?.data || { data: {}};
            const data = { me, users, team_1, team_2, mainUser, myTeam: team_1.some(i => i === me) ? 1 : 2, opponentTeam: team_1.some(i => i === me) ? 2 : 1 };
            room?.data && this.dispatch(setState(data));
            return data;
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            withLoader && this.stopLoading();
        }

    });
    getAnswers = debounce(async (withLoader = true) => {
        if (!this.gameId) {
            console.log('no id for getAnswers');
            return;
        }
        withLoader && this.startLoading();
        try {
            const answers = await api.getAnswers(this.gameId);
            this.dispatch(setState({ answers: answers.data }));
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            withLoader && this.stopLoading();
        }
    })
    setAnswer = async (code, answer) => {
        this.startLoading();
        try {
            const { data: { team_1_code, team_2_code, team_1_player, team_2_player } } = await api.setAnswer(this.roomId, this.gameId, this.user, code, answer);
            await this.getAnswers();
            const newState = { team_1_code, team_2_code, team_1_player, team_2_player }
            Object.keys(newState).forEach(key => {
                if (newState[key] === undefined) {
                    delete newState[key];
                }
            })
            this.dispatch(setState({ ...newState }));
            
            this.wss?.updateAnswers();
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }

    createTeams = async (t1, t2) => {
        this.startLoading();
        try {
            const me = this.getState().me;
            const room = await api.createTeams(this.roomId, t1, t2);
            const { data: { team_1, team_2 } } = room;
            this.dispatch(setState({ team_1, team_2, myTeam: team_1.some(i => i === me) ? 1 : 2 }));
            this.wss.updateRoom();
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }
    agree = async (answerId) => {
        this.startLoading();
        try {
            await api.setAgree(this.roomId, this.gameId, this.user, answerId);
            await this.getAnswers();
            this.wss.updateAnswers();
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }
    guess = async (answerId, guess) => {
        this.startLoading();
        try {
            await api.setGuess(this.roomId, this.gameId, this.user, answerId, guess);
            await this.getAnswers();
            this.wss.updateAnswers();
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }

    nextRound = debounce(async (isFirst) => {
        this.startLoading();
        try {
            const curRound = this.getState().round;
            await api.setNextRound(this.roomId, this.gameId, isFirst ? 0 : curRound);
            await this.getRoom();
            await this.getGame();
            await this.getAnswers();
            this.wss.updateAll();
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    })
    setComment = async (comments) => {
        this.startLoading();
        try {
            const state = this.getState();
            await api.setComment(this.roomId, this.gameId, {
                comments_1: state.myTeam === 1 ? comments : null,
                comments_2: state.myTeam === 2 ? comments : null,
            });
            await this.getGame();
            this.wss.updateGame();
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }
    mixTeams = async () => {
        this.startLoading();
        try {
            await this.createTeams();
            await this.getGame();
            await this.getRoom();
            await this.getAnswers();
            this.wss.updateAll();
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }
    reset = async (mixTeams, t1, t2) => {
        this.startLoading();
        try {
            mixTeams && await this.createTeams(t1, t2);
            await api.reset(this.gameId, this.roomId);
            await this.getGame();
            await this.getRoom();
            await this.getAnswers();
            this.wss.updateAll();
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }
    joinRoom = async (roomId, user) => {
        this.startLoading();
        try {
            const r = await api.joinRoom(roomId, user);
            if ( r.data?._id) {
                const game = await api.getGameByRoomId(r.data?._id);
                this.dispatch(setState({ roomId: r.data?._id, gameId: game.data?._id || null, me: user, shortRoomId: roomId.length === 4 ? roomId : null }));
                this.roomId = r.data?._id;
                localStorage.setItem('roomId', r.data._id);
                localStorage.setItem('userName', user);
                localStorage.setItem('gameId', game.data?._id || null);
            }
            this.wss.updateRoom();
            return r;
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }
    reloadData = debounce(async () => {
        this.dispatch(setState({ ...getInitialState(), isLoading: true }));
        try {
            await this.getRoom();
            await this.getGame();
            await this.getAnswers();
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }, () => {
        this.startLoading();
    })
}

export default Server;