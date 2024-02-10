<script setup lang="ts">
import type { PopulatedChatRoom } from '~/db/repositories/chatroom'
import type { MessageModel } from '~/db/repositories/message'
import type { UserModel } from '~/db/repositories/user'

definePageMeta({
  middleware: [
    'auth',
  ],
  layout: 'chat',
})

const { initSocket, socket } = useSocket()

const roomName = ref('')
const roomNameError = ref<string[]>([])
const room = ref<PopulatedChatRoom>()
const messages = ref<MessageModel[]>([])
const messageContainer = ref<HTMLElement>()
const newMessage = ref('')
const sending = ref(false)

function joinRoom() {
  if (roomName.value === '' || !socket.value)
    return

  socket.value.emit('joinRoom', roomName.value, (errors, data) => {
    if (errors?.name) {
      roomNameError.value = errors.name._errors
    }
    else if (data) {
      roomName.value = ''
      roomNameError.value = []
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

  socket.value?.on('banned', (roomId) => {
    if (!room.value || `${room.value._id}` !== roomId)
      return

    room.value = undefined
    messages.value = []
  })
})

function scrollToBottom() {
  nextTick(() => {
    messageContainer.value?.scrollTo(0, messageContainer.value.scrollHeight)
  })
}

const inspectedUser = ref<Partial<UserModel> | undefined>()
const { user } = useUserSession()

const isAdmin = computed(() => room.value?.adminId === user.value._id)

function openUserModal(toInspect?: Partial<UserModel>) {
  if (toInspect && isAdmin.value && toInspect._id !== user.value._id)
    inspectedUser.value = toInspect
}

function banUser() {
  if (!socket.value || !inspectedUser.value || !room.value)
    return

  socket.value.emit('banUser', `${inspectedUser.value._id}`, (errors) => {
    if (errors)
      console.error(errors)

    inspectedUser.value = undefined
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
        <FormGroup name="roomName" label="Room name" :errors="roomNameError">
          <FormInput v-model="roomName" />
        </FormGroup>
        <template #submit>
          Go !
        </template>
      </FormAuth>
    </div>
  </div>
  <div v-else class="h-full flex flex-col w-full gap-4 p-4">
    <div class="flex justify-between items-center gap-4">
      <a href="#" class="nav-item" @click="leaveRoom">
        <Icon name="heroicons:arrow-left" class="w-6 h-6" />
      </a>
      <h1 class="page-title truncate">
        # {{ room.name }}
      </h1>
      <div class="w-6 h-6" />
    </div>
    <div>
      <p class="mb-1">
        Online :
      </p>
      <div class="flex max-sm:overflow-x-auto sm:flex-wrap sm:overflow-y-auto gap-2 py-2 max-h-24">
        <div v-for="connectedUser in room.connectedUsers" :key="connectedUser.username" class="relative shrink-0" :class="[{ 'cursor-pointer': isAdmin && connectedUser.username !== user.username }]" @click="openUserModal(connectedUser)">
          <Icon v-if="`${connectedUser._id}` === room.adminId" name="heroicons:academic-cap-solid" class="text-primary-400 absolute -top-3 -right-2 h-6 w-6 rotate-12" />
          <UserTag :username="connectedUser.username" />
        </div>
      </div>
    </div>
    <div ref="messageContainer" class="grow overflow-y-auto bg-gray-500/5 rounded-lg">
      <div v-for="message in messages" :key="`${message._id}`" class="flex flex-col gap-1 p-2">
        <div>
          <UserTag :username="message.username" :class="[{ 'cursor-pointer': isAdmin && message.username !== user.username }]" @click="openUserModal(room.connectedUsers.find(u => `${u._id}` === message.userId))" />
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

  <div v-if="inspectedUser" class="absolute inset-0 bg-gray-800/60 p-4">
    <div class="bg-gray-100 dark:bg-gray-900 max-w-md w-full mx-auto flex flex-col gap-4 rounded-lg p-4">
      <p class="text-center">
        <UserTag :username="inspectedUser.username" class="text-2xl" />
      </p>

      <p class="text-lg">
        You are the ruler of this chat room, you can ban this user if you want.<br> But remember:
      </p>
      <p class="italic text-xl text-center">
        "with great power comes great responsibility" <Icon name="game-icons:spider-mask" />
      </p>
      <button class="btn btn-primary" @click="banUser">
        <Icon name="solar:sledgehammer-bold" class="w-5 h-5" />
        Slam the ban hammer
      </button>
      <button class="btn btn-secondary" @click="inspectedUser = undefined">
        Close
      </button>
    </div>
  </div>
</template>
