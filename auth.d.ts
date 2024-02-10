import type { User } from './db/repositories/user'

declare module '#auth-utils' {
  interface UserSession {
    user: User
    socketJwt: string
  }
}
export { }
