import { ZodError } from 'zod'
import { H3Error } from 'h3'
import { ChatRoomRepository } from '~/db/repositories/chatroom.repo'
import type { SafeUserModel } from '~/db/repositories/user.repo'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const user = session.user as SafeUserModel | undefined
  if (!user)
    return setResponseStatus(event, 403, 'Not logged in')

  const { name } = await readBody(event)
  if (!name)
    return setResponseStatus(event, 400, 'Missing room name')

  const chatRoomRepository = new ChatRoomRepository()

  try {
    const room = await chatRoomRepository.findOrCreateOne(user.id, name)
    if (room.bannedUserIds.includes(user.id))
      throw createError({ status: 403, data: { name: 'You have been banned from this room' } })

    return { room }
  }
  catch (error) {
    if (error instanceof H3Error) {
      sendError(event, error)
    }
    else if (error instanceof ZodError) {
      const formatedError = (error as ZodError).format()
      sendError(event, createError({ status: 400, data: formatedError }))
    }
    else {
      sendError(event, createError({ status: 500, data: { name: 'Failed to create or join room' } }))
    }
  }
})
