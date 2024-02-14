import { ZodError } from 'zod'
import { UserRepository } from '~/db/repositories/user.repo'

export default defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event)
    const repo = new UserRepository()
    const user = await repo.create({ username, password })
    const { setSessionWithJwt } = useSessionWithJwt()
    await setSessionWithJwt(user)

    sendNoContent(event, 200)
  }
  catch (error) {
    if (error instanceof ZodError) {
      const formatedError = (error as ZodError).format()
      sendError(event, createError({ status: 400, data: formatedError }))
    }
    else { sendError(event, error as Error) }
  }
})
