/* eslint-disable no-console */
import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'
import { ZodError } from 'zod'
import type { ChatRoomModel } from '~/db/repositories/chatroom'
import { ChatRoomRepository } from '~/db/repositories/chatroom'
import type { MessageModel } from '~/db/repositories/message'
import { MessageRepository } from '~/db/repositories/message'
import { UserRepository } from '~/db/repositories/user'
import type { SafeUserModel } from '~/db/repositories/user'

export default defineNitroPlugin(async (nitro) => {
  let ioInitialized = false
  // Approach inspired from https://github.com/wobsoriano/nuxt3-socket.io
  // Would definetly be wiser to directly use this module in the future
  nitro.hooks.hook('request', async (event) => {
    if (!ioInitialized) {
      startSocketServer((event.node.req.socket as any).server as HttpServer)
      ioInitialized = true
    }
  })
})
export interface ServerToClientEvents {
  joinRoom: (room: ChatRoomModel, users: SafeUserModel[], messages: MessageModel[]) => void
  connectedUsers: (users: SafeUserModel[]) => void
  newMessage: (message: MessageModel) => void
  banned: (roomId: string) => void
}

export interface ClientToServerEvents {
  leaveRoom: () => void
  sendMessage: (contentId: string, callback: (errors: any) => void) => void
  banUser: (userId: string, callback: (errors: any) => void) => void
}

interface SocketData {
  user: SafeUserModel
  user_id: string
  room: ChatRoomModel
}

function startSocketServer(server: HttpServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, never, SocketData>(server, {})

  const chatRoomRepository = new ChatRoomRepository()
  const messageRepository = new MessageRepository()
  const userRepository = new UserRepository()

  // Authenticate user and join room
  io.use(async (socket, next) => {
    const { decode } = useJwt()
    const { jwt } = socket.handshake.auth
    try {
      if (!jwt)
        throw new Error('No JWT provided')
      const user = decode(socket.handshake.auth.jwt)
      if (!user)
        throw new Error('Invalid JWT')

      socket.data.user = user
      socket.data.user_id = user.id

      const slug = socket.handshake.query.slug
      if (!slug || typeof slug !== 'string')
        throw new Error('Room slug missing')

      const room = await chatRoomRepository.joinOneBySlug(user.id, slug)
      if (!room)
        throw new Error('Failed to join room')

      const users = await userRepository.findMany(room.connectedUserIds)
      const messages = await messageRepository.getRecentForRoom(room.id)

      socket.data.room = room
      socket.join(`room:${room.id}`)
      socket.emit('joinRoom', room, users, messages)
      io.to(`room:${room.id}`).emit('connectedUsers', users)
      console.log(`[WS] user ${user.username} connected to room ${room.slug}`)
      next()
    }
    catch (error) {
      next(error as Error)
    }
  })

  io.on('connection', async (socket) => {
    socket.on('sendMessage', async (content, callback) => {
      console.log(`[WS] client ${socket.data.user.username} sends message to room ${socket.data.room.slug}`)
      try {
        const message = await messageRepository.create(socket.data.user, socket.data.room.id, { content })
        io.to(`room:${socket.data.room.id}`).emit('newMessage', message)
        callback(null)
      }
      catch (error) {
        callback(formatError(error))
      }
    })

    socket.on('banUser', async (userId, callback) => {
      console.log(`[WS] client ${socket.data.user.username} banned ${userId} from room ${socket.data.room.slug}`)
      try {
        const room = await chatRoomRepository.findOneAndBanUser(socket.data.user_id, socket.data.room.id, userId)
        if (!room)
          throw new Error('Failed to ban user')
        const users = await userRepository.findMany(room.connectedUserIds)
        const roomId = room._id.toString()
        io.in(`room:${roomId}`).fetchSockets().then((sockets) => {
          for (const socket of sockets) {
            if (socket.data.user_id === userId && socket.data.room.id === roomId) {
              socket.leave(`room:${roomId}`)
              socket.emit('banned', roomId)
            }
          }
        })
        io.to(`room:${socket.data.room.id}`).emit('connectedUsers', users)
        callback(null)
      }
      catch (error) {
        callback(formatError(error))
      }
    })

    socket.on('leaveRoom', () => {
      leaveRoom()
    })

    socket.on('disconnect', async () => {
      leaveRoom()
    })

    async function leaveRoom() {
      const roomId = socket.data.room.id
      console.log(`[WS] client ${socket.data.user.username} left room ${socket.data.room.slug}`)
      const room = await chatRoomRepository.leaveOne(socket.data.user_id, roomId)
      if (!room)
        return

      socket.leave(`room:${roomId}`)
      const users = await userRepository.findMany(room.connectedUserIds)
      io.to(`room:${roomId}`).emit('connectedUsers', users)
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
}
