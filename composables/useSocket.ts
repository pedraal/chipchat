import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '~/server/plugins/socket'

export default function () {
  const { session } = useUserSession()

  const socket = ref<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)

  const { chatError } = useChat()

  function initSocket(slug: string) {
    if (socket.value)
      return
    socket.value = io({
      auth: {
        jwt: session.value.socketJwt,
      },
      query: {
        slug,
      },
      reconnection: false,
    })

    socket.value.on('disconnect', () => {
      chatError.value = 'Disconnected from the chat room'
      navigateTo('/chats')
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
