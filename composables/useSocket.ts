import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '~/server/plugins/socket'

export default function () {
  const config = useRuntimeConfig()
  const { session } = useUserSession()

  const socket = ref<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)

  const { chatError } = useChat()

  function initSocket(slug: string) {
    if (!config.public.socketUrl || socket.value)
      return
    socket.value = io(config.public.socketUrl, {
      auth: {
        jwt: session.value.socketJwt,
      },
      query: {
        slug,
      },
    })

    socket.value.on('connect_error', (error) => {
      chatError.value = error.message
      navigateTo('/chats')
    })
  }

  return {
    socket,
    initSocket,
  }
}
