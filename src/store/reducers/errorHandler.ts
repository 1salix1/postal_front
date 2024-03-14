import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import IParcel, { IParcels } from '../../models/parcel'

interface errorHandlerState {
  error: string | null
}
const errorHandlerState: errorHandlerState = {
  error: null,
}
export const errorSlice = createSlice({
  name: 'error',
  initialState: errorHandlerState,
  reducers: {
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export default errorSlice.reducer
