import { UserRepository } from '~/db/models/user'

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)

  const username = formData.get('username') as string
  const password = formData.get('password') as string
  setCookie(event, 'formData', JSON.stringify({ username, password }))

  const repo = new UserRepository()

  try {
    const user = await repo.authenticate({ username, password })
    await setUserSession(event, { user })

    return sendRedirect(event, '/')
  }
  catch (error) {
    setCookie(event, 'formData', JSON.stringify({ username, password }))
    return sendRedirect(event, '/login?error=true')
  }
})