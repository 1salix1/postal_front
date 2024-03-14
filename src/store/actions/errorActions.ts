import { AppDispatch } from '../store'
import { errorSlice } from '../reducers/errorHandler'

export const resetError = () => async (dispatch: AppDispatch) => {
  dispatch(errorSlice.actions.setError(null))
}
