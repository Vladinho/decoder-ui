import getApi from "../api";
import {setState} from "../reducers/roomReducer";

class Server {
    constructor(dispatch) {
        this.dispatch = dispatch;
        this.gameId = localStorage.getItem('gameId');
        this.roomId = localStorage.getItem('roomId');
        this.user = localStorage.getItem('userName');
    }
    // getGame = async (id = this.gameId) => {
    //     if (!id) {
    //         console.log('no id for getGame');
    //         return;
    //     }
    //     const game = await getApi(this.dispatch).getGame(id);
    //     const { data: { round, team_1_code, team_2_code, words_1, words_2, comments_1, comments_2, team_1_player, team_2_player } } = game;
    //     const data = { round, team_1_code, team_2_code, words_1, words_2, comments_1, comments_2, team_1_player, team_2_player }
    //     this.dispatch(setState(data));
    //     return data;
    // };
    getGame = async (roomId = this.roomId) => {
        if (!roomId) {
            console.log('no id for getGameByRoomId');
            return;
        }
        const game = await getApi(this.dispatch).getGameByRoomId(roomId);
        const { data: { round, team_1_code, team_2_code, words_1, words_2, comments_1, comments_2, team_1_player, team_2_player } } = game;
        const data = { round, team_1_code, team_2_code, words_1, words_2, comments_1, comments_2, team_1_player, team_2_player }
        this.dispatch(setState(data));
        return data;
    };
    getRoom = async (id = this.roomId) => {
        if (!id) {
            console.log('no id for getRoom');
            return;
        }
        const room = await getApi(this.dispatch).getRoom(id);
        const { data: { users, team_1, team_2, mainUser } } = room;
        const data = { users, team_1, team_2, mainUser };
        this.dispatch(setState(data));
        return data;
    };
    getAnswers = async (id = this.gameId) => {
        if (!id) {
            console.log('no id for getAnswers');
            return;
        }
        const answers = await getApi(this.dispatch).getAnswers(id);
        console.log(answers);
        // const { data: {} } = answers
    }
}

export default Server;