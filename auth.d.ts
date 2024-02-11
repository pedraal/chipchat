import type { SafeUserModel } from './db/repositories/user'

declare module '#auth-utils' {
  interface UserSession {
    user: SafeUserModel
    socketJwt: string
  }
}
export {}
