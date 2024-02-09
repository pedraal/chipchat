<script lang="ts" setup>
const name = ref('')

function preventUnlessFilled(event: Event) {
  if (!name.value)
    event.preventDefault()
}
</script>

<template>
  <div class="grow flex items-center justify-center">
    <form action="/api/login/guest" @submit="preventUnlessFilled">
      <div class="flex flex-col gap-1">
        <label for="name" class="text-xl">Enter a name</label>
        <input id="name" v-model="name" type="text" autofocus class="bg-transparent ring ring-gray-900 dark:ring-gray-100 rounded">
      </div>
    </form>
  </div>
</template>
