<!-- src/components/Shortcuts.vue -->
<template>
  <div>
    <div class="fab" @click="toggle">
      ❓
    </div>
    <div class="shortcuts-panel" :class="{ show: visible }">
      <h3>Atalhos de Teclado</h3>
      <ul>
        <li><kbd>Ctrl</kbd> + <kbd>B</kbd> - Novo quadro</li>
        <li><kbd>Ctrl</kbd> + <kbd>C</kbd> - Nova coluna</li>
        <li><kbd>Ctrl</kbd> + <kbd>T</kbd> - Nova tarefa</li>
        <li><kbd>Delete</kbd> - Apagar selecionado</li>
        <li><kbd>F2</kbd> - Renomear</li>
        <li><kbd>Ctrl</kbd> + <kbd>E</kbd> - Exportar</li>
        <li><kbd>Enter</kbd> - Confirmar em modais</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)
function toggle() {
  visible.value = !visible.value
}

// Fecha o painel ao clicar fora
function handleClickOutside(event) {
  const fab = document.querySelector('.fab')
  const panel = document.querySelector('.shortcuts-panel')
  if (
    visible.value &&
    !fab.contains(event.target) &&
    !panel.contains(event.target)
  ) {
    visible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
