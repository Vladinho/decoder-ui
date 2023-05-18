import {useSelector} from "react-redux";
import {useMemo} from "react";
import useMy from "./useMy";

const useCount = (isMyCount = true) => {
    const state = useSelector((state) => state);
    const { myTeam, opponentTeam } = useMy();
    return useMemo(() => {
        return state.answers.reduce((acc, cur) => {
            const answerTeam = state.team_1.some(i => cur.user === i) ? 1 : 2;
            const isAnswered = state.team_1.length === (cur.team_1_agree.length + (answerTeam === 1 ? 1 : 0)) && state.team_2.length === (cur.team_2_agree.length + (answerTeam === 2 ? 1 : 0));
            if (isAnswered && !acc.answeredRounds.some(i => i === cur.round)) {
                acc.answeredRounds.push(cur.round);
            }
            if (isAnswered &&  cur[`team_${isMyCount ? state.myTeam : state.opponentTeam}_guess`] && cur[`team_${isMyCount ? state.opponentTeam : state.myTeam}_guess`]) {
                if ((isMyCount ? myTeam : opponentTeam).some(i => i === cur.user)) {
                    if (cur[`team_${isMyCount ? state.myTeam : state.opponentTeam}_guess`] !== cur.code) {
                        acc.black = acc.black + 1;
                    }
                } else {
                    if (cur[`team_${isMyCount ? state.myTeam : state.opponentTeam}_guess`] === cur.code) {
                        acc.white = acc.white + 1;
                    }
                }
            }
            return acc;
        }, {
            white: 0,
            black: 0,
            answeredRounds: []
        });
    }, [state.answers, isMyCount, state.myTeam, state.opponentTeam, myTeam, opponentTeam]);
}

export default useCount;