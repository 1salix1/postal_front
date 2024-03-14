export interface IUserState {
  name: string | null
}
export interface IUser {
  name: string
  token: string
  refreshToken: string
}
interface IUserResponseSuccess {
  status: true
  user: IUser
}
interface ResponseFailed {
  status: false
  errorMessage: string
}
export type UserResponse = IUserResponseSuccess | ResponseFailed
