import { UserRepository } from '~/db/repositories/user.repo'

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)

  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const repo = new UserRepository()

  try {
    const user = await repo.authenticate({ username, password })
    const { setSessionWithJwt } = useSessionWithJwt()
    await setSessionWithJwt(user)
    return sendRedirect(event, '/chats')
  }
  catch (error) {
    return sendRedirect(event, '/login?error=true')
  }
})
