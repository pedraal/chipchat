import { io } from 'socket.io-client'

export default function () {
  const config = useRuntimeConfig()
  const { session } = useUserSession()
  function initSocket() {
    if (!config.public.socketUrl)
      return
    const socket = io(config.public.socketUrl, {
      auth: {
        jwt: session.value.socketJwt,
      },
    })

    socket.on('connect', () => {
      console.log('Connected to socket')
    })

    socket.on('connect_error', (error) => {
      console.error('connect_error', error)
    })
  }

  return {
    initSocket,
  }
}
