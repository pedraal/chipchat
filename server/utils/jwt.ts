import jwt from 'jsonwebtoken'
import type { User } from '~/db/repositories/user'

export function useJwt() {
  const config = useRuntimeConfig()
  function sign(user: User) {
    return jwt.sign(user, config.session.password, { expiresIn: '365d' })
  }

  function decode(token: string) {
    return jwt.verify(token, config.session.password) as User
  }

  return {
    sign,
    decode,
  }
}
