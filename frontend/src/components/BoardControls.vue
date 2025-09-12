<template>
  <div class="controls">
    <button @click="$emit('new-board')">+ Novo quadro</button>
    <button class="ghost" @click="$emit('import-json')">Importar JSON</button>
    <button class="ghost" @click="$emit('delete-board')">Apagar</button>
  </div>
</template>

<script setup>
// Props ou emits adicionais podem ser definidos conforme necessidade
</script>

<style scoped>
/* estilos adicionais aqui se necessário */
</style>
