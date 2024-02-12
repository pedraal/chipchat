import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '~/server/plugins/socket'

export default function () {
  const { session } = useUserSession()

  const socket = ref<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)

  function initSocket(query: Record<string, any>) {
    if (socket.value)
      return
    socket.value = io({
      auth: {
        jwt: session.value.socketJwt,
      },
      query,
      reconnection: false,
    })
  }

  return {
    socket,
    initSocket,
  }
}
