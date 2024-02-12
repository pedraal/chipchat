import type { UserModel } from '~/db/repositories/user.repo'

export function useSessionWithJwt() {
  async function setSessionWithJwt(user: UserModel) {
    const event = useEvent()
    const _user = { ...user, password: undefined }
    await setUserSession(event, { user: _user, socketJwt: useJwt().sign(_user) })
  }

  return { setSessionWithJwt }
}
