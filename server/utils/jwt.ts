import jwt from 'jsonwebtoken'
import type { UserModel } from '~/db/repositories/user'

export function useJwt() {
  const config = useRuntimeConfig()
  function sign(user: UserModel) {
    return jwt.sign(user, config.session.password, { expiresIn: '365d' })
  }

  function decode(token: string) {
    return jwt.verify(token, config.session.password) as UserModel
  }

  return {
    sign,
    decode,
  }
}
