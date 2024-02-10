import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '~/server/plugins/socket'

export default function () {
  const config = useRuntimeConfig()
  const { session } = useUserSession()

  const socket = ref<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)

  function initSocket() {
    if (!config.public.socketUrl || socket.value)
      return
    socket.value = io(config.public.socketUrl, {
      auth: {
        jwt: session.value.socketJwt,
      },
    })

    socket.value.on('connect_error', (error) => {
      console.error('connect_error', error)
    })
  }

  return {
    socket,
    initSocket,
  }
}
