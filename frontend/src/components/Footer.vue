<!-- src/components/Footer.vue -->
<template>
  <footer class="footer">
    <div class="spotify-section">
      <div style="display: flex; gap: 8px; align-items: center;">
        <button @click="showPlayer = true" class="ghost">🎵 Adicionar Playlist</button>
        <button v-if="showPlayer" @click="removePlayer" class="ghost">❌ Remover</button>
      </div>
      <div v-if="showPlayer" class="spotify-player">
        <iframe
          style="border-radius: 12px"
          width="300"
          height="80"
          :src="spotifyEmbed"
          frameBorder="0"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const showPlayer = ref(false)
const spotifyEmbed = 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdxcBWuJkbcy?utm_source=generator'

function removePlayer() {
  showPlayer.value = false
}
</script>
