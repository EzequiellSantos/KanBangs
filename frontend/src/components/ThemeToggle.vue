<!-- src/components/ThemeToggle.vue -->
<template>
  <div class="theme-toggle">
    <span>🌙</span>
    <div
      class="toggle-switch"
      :class="{ active: !darkMode }"
      @click="toggle"
    >
      <div class="toggle-knob">{{ darkMode ? '🌙' : '☀️' }}</div>
    </div>
    <span>☀️</span>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useUIStore } from '@/store/ui'

const ui = useUIStore()
const darkMode = computed(() => ui.darkMode)

function toggle() {
  ui.toggleDarkMode()
}

// Garante que o atributo data-theme é atualizado no <html> ao trocar o tema
watch(
  () => ui.darkMode,
  (isDark) => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  },
  { immediate: true }
)
</script>
