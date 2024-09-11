export interface IUserState {
  name: string | null
  loading: boolean
  error: string | null
}
export interface IUser {
  name: string
  token: string
  refreshToken: string
}
