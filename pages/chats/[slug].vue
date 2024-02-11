<script setup lang="ts">
import type { ChatRoomModel } from '~/db/repositories/chatroom'
import type { MessageModel } from '~/db/repositories/message'
import type { SafeUserModel } from '~/db/repositories/user'

definePageMeta({
  middleware: [
    'auth',
  ],
  layout: 'chat',
})

const route = useRoute()

const { initSocket, socket } = useSocket()

const { chatError } = useChat()

const room = ref<ChatRoomModel>()
const messages = ref<MessageModel[]>([])
const connectedUsers = ref<SafeUserModel[]>([])
const messageContainer = ref<HTMLElement>()
const newMessage = ref('')
const sending = ref(false)

function leaveRoom() {
  if (socket.value)
    socket.value.emit('leaveRoom')

  navigateTo('/chats')
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
  initSocket(route.params.slug as string)

  socket.value?.on('joinRoom', (_room, _connectedUsers, _messages) => {
    room.value = _room
    connectedUsers.value = _connectedUsers
    messages.value = _messages.reverse()
    scrollToBottom()
  })

  socket.value?.on('connectedUsers', (users) => {
    connectedUsers.value = users
  })

  socket.value?.on('newMessage', (message) => {
    const willScroll = messageContainer.value && messageContainer.value?.scrollHeight - messageContainer.value?.scrollTop === messageContainer.value?.clientHeight
    messages.value.push(message)
    if (willScroll)
      scrollToBottom()
  })

  socket.value?.on('banned', () => {
    chatError.value = `You have been banned from ${room.value?.name || 'this chat'}`
    navigateTo('/chats')
  })
})

function scrollToBottom() {
  nextTick(() => {
    messageContainer.value?.scrollTo(0, messageContainer.value.scrollHeight)
  })
}

const inspectedUser = ref<SafeUserModel | undefined>()
const { user } = useUserSession()

const isAdmin = computed(() => room.value?.adminId === user.value.id)

function openUserModal(toInspect?: SafeUserModel) {
  if (toInspect && isAdmin.value && toInspect.id !== user.value.id)
    inspectedUser.value = toInspect
}

function banUser() {
  if (!socket.value || !inspectedUser.value || !room.value)
    return

  socket.value.emit('banUser', inspectedUser.value.id, (errors) => {
    if (errors)
      console.error(errors)

    inspectedUser.value = undefined
  })
}
</script>

<template>
  <div v-if="room" class="h-full flex flex-col w-full gap-4 p-4">
    <div class="flex justify-between items-center gap-4">
      <a href="#" class="nav-item" @click.prevent="leaveRoom">
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
      <div class="flex max-sm:overflow-x-auto sm:flex-wrap sm:overflow-y-auto gap-2 py-2 max-h-24" data-testid="connected-users">
        <div v-for="connectedUser in connectedUsers" :key="connectedUser.username" class="relative shrink-0" :class="[{ 'cursor-pointer': isAdmin && connectedUser.username !== user.username }]" @click="openUserModal(connectedUser)">
          <Icon v-if="`${connectedUser._id}` === room.adminId" name="heroicons:academic-cap-solid" class="text-primary-400 absolute -top-3 -right-2 h-6 w-6 rotate-12" />
          <UserTag :username="connectedUser.username" />
        </div>
      </div>
    </div>
    <div ref="messageContainer" class="grow overflow-y-auto bg-gray-500/5 rounded-lg">
      <div v-for="message in messages" :key="`${message._id}`" class="flex flex-col gap-1 p-2" data-testid="message">
        <div data-testid="message-user">
          <UserTag :username="message.username" :class="[{ 'cursor-pointer': isAdmin && message.username !== user.username }]" @click="openUserModal(connectedUsers.find(u => u.id === message.userId))" />
        </div>
        <p data-testid="message-content">
          {{ message.content }}
        </p>
      </div>
    </div>
    <form class="flex gap-2" @submit.prevent="sendMessage">
      <FormInput v-model="newMessage" class="w-full" placeholder="Type your message here" />
      <button class="bg-primary-500 hover:bg-primary-600 transition-colors w-8 flex items-center justify-center rounded-lg text-white" type="submit" data-testid="submit">
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
        "with great power comes great responsibility"
        <Icon name="game-icons:spider-mask" />
      </p>
      <button class="btn btn-primary" data-testid="ban-button" @click="banUser">
        <Icon name="solar:sledgehammer-bold" class="w-5 h-5" />
        Slam the ban hammer
      </button>
      <button class="btn btn-secondary" data-testid="close-inspect-modal" @click="inspectedUser = undefined">
        Close
      </button>
    </div>
  </div>
</template>
