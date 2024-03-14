import { configureStore } from '@reduxjs/toolkit'
import { errorHandler, parcelReducer, userReducer } from './reducers'

export const store = configureStore({
  reducer: {
    parcelReducer,
    userReducer,
    errorHandler,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch

export default store
