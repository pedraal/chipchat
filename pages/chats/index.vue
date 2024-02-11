<script setup lang="ts">
definePageMeta({
  middleware: [
    'auth',
  ],
  layout: 'chat',
})

const roomName = ref('')
const formError = ref<string[]>([])
const joining = ref(false)

const { chatError } = useChat()

if (chatError.value !== '') {
  formError.value.push(chatError.value)
  chatError.value = ''
}

async function joinRoom() {
  if (roomName.value === '' || joining.value)
    return

  joining.value = true

  $fetch(`/api/chats/join`, {
    method: 'POST',
    body: { name: roomName.value },
    async onResponseError({ response }) {
      formError.value.push(response.statusText)
    },
  }).then(({ room }) => {
    navigateTo(`/chats/${room.slug}`)
  }).catch(() => {
    joining.value = false
  })
}
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center p-4">
    <div class="w-full px-4 mx-auto">
      <h1 class="page-title mb-4">
        Its time to join or create a chat room !
      </h1>
      <Form @submit.prevent="joinRoom">
        <FormGroup name="roomName" label="Room name" :errors="formError">
          <FormInput v-model="roomName" />
        </FormGroup>
        <template #submit>
          Go !
        </template>
      </Form>
    </div>
  </div>
</template>
