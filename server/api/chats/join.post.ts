import { ZodError } from 'zod'
import type { ChatRoomDTO } from '~/db/repositories/chatroom'
import { ChatRoomRepository } from '~/db/repositories/chatroom'
import type { SafeUserModel } from '~/db/repositories/user'

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
      return setResponseStatus(event, 403, 'You have been banned from this room')

    return { room }
  }
  catch (error) {
    if (error instanceof ZodError) {
      const formatedError = (error as ZodError<ChatRoomDTO>).format()
      return setResponseStatus(event, 400, formatedError.name?._errors[0])
    }
    else { return setResponseStatus(event, 400, 'Failed to create or join room') }
  }
})
