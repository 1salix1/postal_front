import { configureStore } from '@reduxjs/toolkit'
import { notificationHandler, parcelReducer, userReducer } from './reducers'

export const store = configureStore({
  reducer: {
    parcelReducer,
    userReducer,
    notificationHandler,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch

export default store
