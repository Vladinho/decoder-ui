import { createSlice } from '@reduxjs/toolkit'

export const roomSlice = createSlice({
    name: 'room',
    initialState: {
        round: null,
        comments_1: [],
        comments_2: [],
        mainUser: null,
        team_1: [],
        team_2: [],
        users: [],
        me: localStorage.getItem('userName') || null,
        myTeam: null,
        isLoading: false,
        roomId: localStorage.getItem('roomId') || null,
        gameId: localStorage.getItem('gameId') || null,
        team_1_code: null,
        team_2_code: null,
        team_1_player: null,
        team_2_player: null,
        words_1: [],
        words_2: [],
        answers: [],
        errors: [],
    },
    reducers: {
        setState: (state, { payload }) => {
            if (!state.myTeam && state.me && state.team_1.length && state.team_2.length) {
                state.myTeam = state.team_1.some(i => i === state.me) ? 1 : 2;
            }
            Object.keys(payload).forEach((key) => {
                if (payload[key] !== undefined) {
                    state[key] = payload[key];
                }
            })
        }
    },
})

// Action creators are generated for each case reducer function
export const { setState } = roomSlice.actions

export default roomSlice.reducer