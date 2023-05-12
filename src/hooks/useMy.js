import {useSelector} from "react-redux";

const useMy = () => {
    const state = useSelector((state) => state);

    let code = '';
    let opponentCode = '';
    let words = [];
    let opponentWords = [];
    let curPlayer = '';
    let opponentCurPlayer = '';
    let comments = [];
    let opponentComments = [];
    let answers = [];
    let opponentAnswers = [];
    let myTeam = [];
    let opponentTeam = [];
    if (state.myTeam === 1) {
        myTeam = state.team_1;
        opponentTeam = state.team_2;
        code = state.team_1_code;
        opponentCode = state.team_2_code;
        words = state.words_1;
        opponentWords = state.words_2;
        curPlayer = state.team_1_player;
        opponentCurPlayer = state.team_2_player;
        comments = state.comments_1;
        opponentComments = state.comments_2;
    } else {
        myTeam = state.team_2;
        opponentTeam = state.team_1;
        code = state.team_2_code;
        opponentCode = state.team_1_code;
        words = state.words_2;
        opponentWords = state.words_1;
        curPlayer = state.team_2_player;
        opponentCurPlayer = state.team_1_player;
        comments = state.comments_2;
        opponentComments = state.comments_1;
    }

    answers = state.answers.filter(({ user }) => myTeam.some(i => i === user));
    opponentAnswers = state.answers.filter(({ user }) => opponentTeam.some(i => i === user));

    return {
        code,
        opponentCode,
        words,
        opponentWords,
        curPlayer,
        opponentCurPlayer,
        comments,
        opponentComments,
        answers,
        opponentAnswers,
        myTeam,
        opponentTeam
    }
}

export default useMy;