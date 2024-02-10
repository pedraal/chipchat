import type { UserModel } from '~/db/repositories/user'

export function useSessionWithJwt() {
  async function setSessionWithJwt(user: UserModel) {
    const event = useEvent()
    await setUserSession(event, { user, socketJwt: useJwt().sign(user) })
  }

  return { setSessionWithJwt }
}
