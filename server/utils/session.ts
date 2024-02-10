import type { User } from '~/db/repositories/user'

export function useSessionWithJwt() {
  async function setSessionWithJwt(user: User) {
    const event = useEvent()
    await setUserSession(event, { user, socketJwt: useJwt().sign(user) })
  }

  return { setSessionWithJwt }
}
