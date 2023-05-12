import { configureStore } from '@reduxjs/toolkit'
import roomReducer from "./reducers/roomReducer";

export default configureStore({
    reducer: roomReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})