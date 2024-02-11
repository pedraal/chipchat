import { ZodError } from 'zod'
import { UserRepository } from '~/db/repositories/user'

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)

  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const repo = new UserRepository()

  try {
    const user = await repo.create({ username, password })
    const { setSessionWithJwt } = useSessionWithJwt()
    await setSessionWithJwt(user)

    return sendRedirect(event, '/chat')
  }
  catch (error) {
    if (error instanceof ZodError)
      setCookie(event, 'formErrors', JSON.stringify(error.format()))
    else
      console.error(error)

    setCookie(event, 'formData', JSON.stringify({ username, password }))
    return sendRedirect(event, '/signup')
  }
})
