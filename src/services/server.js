import {initialState, setState} from "../reducers/roomReducer";
import api from "../api";
import store from "../store";

const dev = 'wss://decoder-web-sockets.herokuapp.com/ws'

class Server {
    constructor() {
        if (!Server._instance) {
            this.updateData();
            this.setWebSocket();
            Server._instance = this;
        }

        if (!Server._instance.ws) {
            Server._instance.setWebSocket();
        }
        Server._instance.updateData();
        return Server._instance;
    }

    updateData = () => {
        this.dispatch = store.dispatch;
        this.getState = store.getState;
        this.gameId = localStorage.getItem('gameId');
        this.roomId = localStorage.getItem('roomId');
        this.user = localStorage.getItem('user');
    }

    setWebSocket = () => {
        if (!this.ws) {
            this.connectToServer().then((ws) => {
                ws.onmessage = (webSocketMessage) => {
                    if (webSocketMessage && webSocketMessage.data) {
                        this.onWebSocketMessage(webSocketMessage.data)
                    }
                }
                ws.onclose = () => {
                    this.ws = null;
                    setTimeout(this.setWebSocket, 3000)
                }
            }).catch((e) => {
                this.ws = null;
                setTimeout(this.connectToServer, 2000);
            });
        }
    }

    onWebSocketMessage = (msg) => {
        switch (msg) {
            case 'update answers':
                return this.getAnswers(false);
            case 'update game':
                return this.getGame(false);
            case 'update room':
                return this.getRoom(false);
            default:
                console.error('No msg handler!')
        }
    }
    connectToServer = async () =>  {
        const ws = new WebSocket(`${dev}?roomId=${this.roomId}&gameId=${this.gameId}`);
        ws.onclose = () => {
            setTimeout(this.connectToServer, 1000);
        };
        this.ws = ws;
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer)
                    resolve(ws);
                }
            }, 10);
        });
    }
    startLoading = () => {
        this.dispatch(setState({ isLoading: true }));
    }
    stopLoading = () => {
        this.dispatch(setState({ isLoading: false }));
    }
    getGame = async (withLoader = true) => {
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

    };
    getRoom = async (withLoader = true) => {
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

    };
    getAnswers = async (withLoader = true) => {
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
    }
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
            
            this.ws?.send(JSON.stringify({ data: 'update answers' }));
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
            this.ws?.send(JSON.stringify({data: 'update room'}));
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
            this.ws?.send(JSON.stringify({data: 'update answers'}));
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
            this.ws?.send(JSON.stringify({data: 'update answers'}));
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }

    nextRound = async () => {
        this.startLoading();
        try {
            const curRound = this.getState().round;
            await api.setNextRound(this.roomId, this.gameId, curRound);
            await this.getGame();
            await this.getAnswers();
            this.ws?.send(JSON.stringify({data: 'update game'}));
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }
    setComment = async (comments) => {
        this.startLoading();
        try {
            const state = this.getState();
            await api.setComment(this.roomId, this.gameId, {
                comments_1: state.myTeam === 1 ? comments : null,
                comments_2: state.myTeam === 2 ? comments : null,
            });
            await this.getGame();
            this.ws?.send(JSON.stringify({data: 'update game'}));
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
            this.ws?.send(JSON.stringify({data: 'update room'}));
            this.ws?.send(JSON.stringify({data: 'update game'}));
            this.ws?.send(JSON.stringify({data: 'update answers'}));
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
                localStorage.setItem('user', user);
                localStorage.setItem('gameId', game.data?._id || null);
            }
            this.ws?.send(JSON.stringify({data: 'update room'}));
            return r;
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }
    reloadData = async () => {
        this.dispatch(setState({...initialState}));
        this.startLoading();
        try {
            await this.getRoom();
            await this.getGame();
            await this.getAnswers();
        } catch (e) {
            this.dispatch(setState({ errors: [e] }));
        } finally {
            this.stopLoading();
        }
    }
}

export default Server;