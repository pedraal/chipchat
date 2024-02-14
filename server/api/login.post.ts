import { H3Error } from 'h3'
import { UserRepository } from '~/db/repositories/user.repo'

export default defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event)
    const repo = new UserRepository()
    const user = await repo.authenticate({ username, password })
    if (!user)
      throw createError({ status: 401, data: { message: 'Invalid username or password' } })
    const { setSessionWithJwt } = useSessionWithJwt()
    await setSessionWithJwt(user)
    return sendNoContent(event, 200)
  }
  catch (error) {
    if (error instanceof H3Error)
      sendError(event, error)
    else
      sendError(event, createError({ status: 500, data: { message: 'Failed to authenticate' } }))
  }
})
