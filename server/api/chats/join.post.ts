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
  const room = await chatRoomRepository.findOrCreateOne(user.id, name)

  if (!room)
    return setResponseStatus(event, 500, 'Failed to create room')
  if (room.bannedUserIds.includes(user.id))
    return setResponseStatus(event, 403, 'You have been banned from this room')

  return { room }
})
