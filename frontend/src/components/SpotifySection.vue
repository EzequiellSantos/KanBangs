<template>
  <div class="spotify-section">
    <div style="display: flex; gap: 8px; align-items: center;">
      <button class="ghost" @click="$emit('add')">🎵 Adicionar Playlist</button>
      <button class="ghost" v-if="showRemove" @click="$emit('remove')">❌ Remover</button>
    </div>
    <div id="spotifyContainer">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  showRemove: Boolean
})

defineEmits(['add', 'remove'])
</script>
