<template>
  <div class="main-head">
    <div>
      <div class="board-title">{{ title }}</div>
      <div class="muted small">{{ desc }}</div>
    </div>
    <div>
      <button class="ghost" @click="$emit('add-column')">+ a</button>
      <!-- <button @click="$emit('export-json')">Exportar JSON</button> -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  desc: String
})

defineEmits(['add-column', 'export-json'])
</script>
