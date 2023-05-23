import {useSelector} from "react-redux";
import {useMemo} from "react";
import useMy from "./useMy";

const useCount = (isMyCount = true) => {
    const state = useSelector((state) => state);
    const { myTeam, opponentTeam } = useMy();

    return useMemo(() => {
        const {answeredRoundsTeam_1, answeredRoundsTeam_2} = state.answers.reduce((acc, cur) => {
            const answerTeam = state.team_1.some(i => cur.user === i) ? 1 : 2;
            const isAnswered_1 = state.team_1.length === (cur.team_1_agree.length + (answerTeam === 1 ? 1 : 0));
            const isAnswered_2 = state.team_2.length === (cur.team_2_agree.length + (answerTeam === 2 ? 1 : 0));
            const isAnswered = isAnswered_1 && isAnswered_2
            if (isAnswered) {
                acc[`answeredRoundsTeam_${answerTeam}`].push(cur.round);
            }
            return acc;
        }, {
            answeredRoundsTeam_1: [],
            answeredRoundsTeam_2: []
        });

        const answeredRounds = answeredRoundsTeam_1.filter(i => answeredRoundsTeam_2.some(j => j === i && i))
        return state.answers.reduce((acc, cur) => {
            const isAnswered = answeredRounds.some(i => cur.round === i)
            if (isAnswered &&
                cur[`team_${isMyCount ? state.myTeam : state.opponentTeam}_guess`] &&
                cur[`team_${isMyCount ? state.opponentTeam : state.myTeam}_guess`]
            ) {
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
            answeredRounds,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.answers, isMyCount, state.myTeam, state.opponentTeam, myTeam, opponentTeam]);
}

export default useCount;