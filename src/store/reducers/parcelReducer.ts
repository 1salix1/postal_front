import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import IParcel, { IParcels } from '../../models/parcel'

interface ParcelState {
  parcels: IParcel[]
  parcel: IParcel | null
  isLoading: boolean
  total: number
}
const parcelState: ParcelState = {
  parcels: [],
  total: 0,
  parcel: null,
  isLoading: false,
}
export const parcelSlice = createSlice({
  name: 'postal',
  initialState: parcelState,
  reducers: {
    setParcel(state, action: PayloadAction<IParcel | null>) {
      state.parcel = action.payload
      state.isLoading = false
    },
    setParcelsList(state, action: PayloadAction<IParcels>) {
      state.parcels = action.payload.parcels
      state.total = action.payload.total
      state.isLoading = false
    },
    addParcel(state, action: PayloadAction<IParcel>) {
      state.parcels = [action.payload, ...state.parcels]
      state.total++
    },
    deleteParcel(state, action: PayloadAction<number>) {
      state.parcels = state.parcels.filter(parcel => parcel.id !== action.payload)
      state.total--
    },
    deleteParcelStatus(state, action: PayloadAction<number>) {
      if (state.parcel?.statuses)
        state.parcel.statuses = state.parcel?.statuses.filter(status => status.id !== action.payload)
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
  },
})

export default parcelSlice.reducer
