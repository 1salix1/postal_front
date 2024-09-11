import { createSlice, PayloadAction, current } from '@reduxjs/toolkit'

interface notificationHandlerState {
  alerts: { message: string; type: 'error' | 'success' }[]
}
const notificationHandlerState: notificationHandlerState = {
  alerts: [],
}
export const errorSlice = createSlice({
  name: 'notification',
  initialState: notificationHandlerState,
  reducers: {
    setNotifications(state, action: PayloadAction<{ message: string; type: 'error' | 'success' }[]>) {
      state.alerts = action.payload
    },
    addNotification(state, action: PayloadAction<{ message: string; type: 'error' | 'success' }>) {
      state.alerts = [...current(state.alerts), action.payload]
    },
  },
})
export const { addNotification, setNotifications } = errorSlice.actions
export default errorSlice.reducer
