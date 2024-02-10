/* eslint-disable no-console */
import { Server } from 'socket.io'
import { DbClient } from '~/db/client'
import type { User } from '~/db/repositories/user'

interface ServerToClientEvents {
}

interface ClientToServerEvents {
}

interface InterServerEvents {
}

interface SocketData {
  user: User
}

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  // Workaround for nitro plugins not being loaded asynchronously
  await DbClient.waitConnection()

  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(config.socketPort, {
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
      next()
    }
    catch (error) {
      next(error as Error)
    }
  })

  io.on('connection', async (socket) => {
    console.log(`[WS] client connected: ${socket.id}`)
  })

  console.log('[WS] server started.')
})
