import { createSlice } from '@reduxjs/toolkit'

export const getInitialState = () => ({
    round: null,
    comments_1: [],
    comments_2: [],
    mainUser: null,
    team_1: [],
    team_2: [],
    users: [],
    me: localStorage.getItem('userName') || null,
    myTeam: null,
    opponentTeam: null,
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
    modalCallback: null,
    isMyDetailsOpened: false,
    isOpponentDetailsOpened: false,
    isDndInProgress: false,
    shortRoomId:  localStorage.getItem('shortRoomId') || null,
})
export const roomSlice = createSlice({
    name: 'room',
    initialState: getInitialState(),
    reducers: {
        setState: (state, { payload }) => {
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