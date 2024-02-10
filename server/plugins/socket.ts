/* eslint-disable no-console */
import { Server } from 'socket.io'
import { ZodError } from 'zod'
import { DbClient } from '~/db/client'
import type { PopulatedChatRoom } from '~/db/repositories/chatroom'
import { ChatRoomRepository } from '~/db/repositories/chatroom'
import type { MessageModel } from '~/db/repositories/message'
import { MessageRepository } from '~/db/repositories/message'
import type { UserModel } from '~/db/repositories/user'

export interface ServerToClientEvents {
  roomUpdate: (room: PopulatedChatRoom) => void
  newMessage: (message: MessageModel) => void
}

export interface ClientToServerEvents {
  joinRoom: (roomName: string, callback: (errors: any, roomAndMessages?: { room: PopulatedChatRoom, messages: MessageModel[] }) => void) => void
  leaveRoom: () => void
  sendMessage: (contentId: string, callback: (errors: any) => void) => void
}

interface SocketData {
  user: UserModel
  user_id: string
  currentRoomId: string
}

export default defineNitroPlugin(async (nitro) => {
  const config = useRuntimeConfig()

  // Workaround for nitro plugins not being loaded asynchronously
  await DbClient.waitConnection()

  const io = new Server<ClientToServerEvents, ServerToClientEvents, never, SocketData>(config.socketPort, {
    cors: {
      origin: config.origin,
      credentials: true,
    },
  })

  io.use((socket, next) => {
    const { decode } = useJwt()
    const { jwt } = socket.handshake.auth
    try {
      if (!jwt)
        throw new Error('No JWT provided')
      const user = decode(socket.handshake.auth.jwt)
      if (!user)
        throw new Error('Invalid JWT')

      socket.data.user = user
      socket.data.user_id = user._id.toString()
      socket.data.currentRoomId = ''
      next()
    }
    catch (error) {
      next(error as Error)
    }
  })

  const chatRoomRepository = new ChatRoomRepository()
  const messageRepository = new MessageRepository()

  io.on('connection', async (socket) => {
    console.log(`[WS] client connected: ${socket.id}`)

    socket.on('joinRoom', async (roomName, callback) => {
      console.log(`[WS] client ${socket.data.user_id} joining room: ${roomName}`)
      try {
        let room = await chatRoomRepository.joinOne(socket.data.user_id, roomName)
        if (!room)
          room = await chatRoomRepository.create(socket.data.user_id, { name: roomName })
        socket.join(`room:${room._id.toString()}`)
        socket.data.currentRoomId = room._id.toString()
        const roomWithUsers = await chatRoomRepository.populateUsers(room)
        const messages = await messageRepository.getRecentForRoom(room._id.toString())
        callback(null, { room: roomWithUsers, messages })
        io.to(`room:${room._id.toString()}`).emit('roomUpdate', roomWithUsers)
      }
      catch (error) {
        callback(formatError(error), undefined)
      }
    })

    socket.on('leaveRoom', () => {
      leaveRoom()
    })

    socket.on('sendMessage', async (content, callback) => {
      console.log(`[WS] client ${socket.data.user_id} sending message in room: ${socket.data.currentRoomId}`)
      try {
        const message = await messageRepository.create(socket.data.user, socket.data.currentRoomId, { content })
        callback(null)
        io.to(`room:${socket.data.currentRoomId}`).emit('newMessage', message)
      }
      catch (error) {
        callback(formatError(error))
      }
    })

    socket.on('disconnect', async () => {
      console.log(`[WS] client ${socket.data.user_id} disconnected`)
      leaveRoom()
    })

    async function leaveRoom() {
      if (socket.data.currentRoomId === '')
        return
      const roomId = socket.data.currentRoomId
      console.log(`[WS] client ${socket.data.user_id} leaving room: ${roomId}`)
      const room = await chatRoomRepository.leaveOne(socket.data.user_id, roomId)
      if (!room)
        return

      socket.leave(`room:${roomId}`)
      socket.data.currentRoomId = ''
      const roomWithUsers = await chatRoomRepository.populateUsers(room)
      io.to(`room:${roomId}`).emit('roomUpdate', roomWithUsers)
    }

    function formatError(error: any) {
      if (error instanceof ZodError)
        return error.format()
      else if (error instanceof Error)
        return error.message
      else
        return error
    }
  })

  console.log('[WS] server started.')

  nitro.hooks.hook('close', () => {
    io.close()
    console.log('[WS] server closed.')
  })
})
