<script setup lang="ts">
import type { PopulatedChatRoom } from '~/db/repositories/chatroom'
import type { MessageModel } from '~/db/repositories/message'

definePageMeta({
  middleware: [
    'auth',
  ],
  layout: 'chat',
})

const { initSocket, socket } = useSocket()

const roomName = ref('')
const room = ref<PopulatedChatRoom>()
const messages = ref<MessageModel[]>([])
const newMessage = ref('')
const sending = ref(false)

const messageContainer = ref<HTMLElement>()

function joinRoom() {
  if (roomName.value === '' || !socket.value)
    return

  socket.value.emit('joinRoom', roomName.value, (errors, data) => {
    if (errors) { console.error(errors) }
    else if (data) {
      room.value = data.room
      messages.value = data.messages.reverse()
      scrollToBottom()
    }
  })
}

function leaveRoom() {
  if (!socket.value)
    return

  socket.value.emit('leaveRoom')
  room.value = undefined
  messages.value = []
}

function sendMessage() {
  if (!socket.value || !room.value || newMessage.value === '' || sending.value)
    return
  sending.value = true
  socket.value.emit('sendMessage', newMessage.value, (_) => {
    sending.value = false
    newMessage.value = ''
    scrollToBottom()
  })
}

onMounted(() => {
  initSocket()

  socket.value?.on('roomUpdate', (_room) => {
    room.value = _room
  })

  socket.value?.on('newMessage', (message) => {
    const willScroll = messageContainer.value && messageContainer.value?.scrollHeight - messageContainer.value?.scrollTop === messageContainer.value?.clientHeight
    messages.value.push(message)
    if (willScroll)
      scrollToBottom()
  })
})

function scrollToBottom() {
  nextTick(() => {
    messageContainer.value?.scrollTo(0, messageContainer.value.scrollHeight)
  })
}
</script>

<template>
  <div v-if="!room" class="h-full flex flex-col items-center justify-center p-4">
    <div class="w-full px-4 mx-auto">
      <h1 class="page-title mb-4">
        Its time to join or create a chat room !
      </h1>
      <FormAuth @submit.prevent="joinRoom">
        <FormGroup name="roomName" label="Room name">
          <FormInput v-model="roomName" />
        </FormGroup>
        <template #submit>
          Go !
        </template>
      </FormAuth>
    </div>
  </div>
  <div v-else class="h-full flex flex-col w-full gap-4 p-4">
    <div class="flex justify-between">
      <a href="#" class="nav-item" @click="leaveRoom">
        <Icon name="heroicons:arrow-left" class="w-6 h-6" />
      </a>
      <h1 class="page-title">
        # {{ room.name }}
      </h1>
      <div class="w-6 h-6" />
    </div>
    <div>
      <p class="mb-1">
        Online :
      </p>
      <div class="flex max-sm:overflow-x-auto sm:flex-wrap sm:overflow-y-auto gap-2 py-2 max-h-24">
        <UserTag v-for="user in room.connectedUsers" :key="user.username" :username="user.username" class="shrink-0" />
      </div>
    </div>
    <div ref="messageContainer" class="grow overflow-y-auto bg-gray-500/5 rounded-lg">
      <div v-for="message in messages" :key="`${message._id}`" class="flex flex-col gap-1 p-2">
        <div>
          <UserTag :username="message.username" class="shrink-0" />
        </div>
        <p>
          {{ message.content }}
        </p>
      </div>
    </div>
    <form class="flex gap-2" @submit.prevent="sendMessage">
      <FormInput v-model="newMessage" class="w-full" placeholder="Type your message here" />
      <button class="bg-primary-500 hover:bg-primary-600 transition-colors w-8 flex items-center justify-center rounded-lg text-white" type="submit">
        <Icon name="heroicons:paper-airplane" class="w-6 h-6" />
      </button>
    </form>
  </div>
</template>
