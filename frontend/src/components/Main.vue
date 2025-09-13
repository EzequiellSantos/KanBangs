<!-- src/components/Main.vue -->
<template>
  <main class="main">
    <!-- Cabeçalho do quadro -->
    <div class="main-head">
      <div>
        <div class="board-title">{{ currentBoard?.title || 'Sem quadro' }}</div>
        <div class="muted small">{{ currentBoard?.desc || 'Selecione ou crie um quadro' }}</div>
      </div>
      <div>
        <button class="ghost" @click="abrirModalColuna">+ Coluna</button>
        <!-- <button @click="$emit('export-board')">Exportar JSON</button> -->
      </div>
    </div>

    <!-- Colunas -->
    <div v-if="currentBoard && currentBoard.columns?.length" class="columns-wrap" tabindex="0" aria-live="polite">
    <Column
      v-for="(col, idx) in currentBoard.columns"
      :key="col._id"
      :column="col"
      :columnIndex="idx"
      @add-task="handleAddTask"
      @delete-task="handleDeleteTask"
      @delete-column="handleDeleteColumn"
      @drag-column="handleDragColumn"
      @drop-column="handleDropColumn"
    />
    </div>

    <!-- Estado vazio -->
    <div v-else class="empty">Nenhum quadro ou coluna selecionado. Crie um novo quadro para começar.</div>

    <!-- Área de motivação -->
    <div class="motivation-container">
      <div v-if="!image" class="motivation-placeholder">Adicione uma imagem de motivação</div>
      <img v-if="image" :src="image" class="motivation-image" />
      <div class="motivation-actions">
        <label for="motivationFileInput" class="file-input-label">Selecionar imagem</label>
        <input type="file" id="motivationFileInput" accept="image/*" @change="onFileSelect">
        <button v-if="image" class="ghost" @click="removeImage">Remover imagem</button>
      </div>
    </div>

    <!-- Modal para adicionar coluna -->
    <Modal
      :visible="modalColunaVisivel"
      title="Nova Coluna"
      @ok="confirmarColuna"
      @cancel="fecharModalColuna"
    >
      <input v-model="nomeColuna" type="text" placeholder="Nome da coluna" />
    </Modal>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import Column from './Column.vue'
import Modal from '@/components/Modal.vue'
import {BASE_URL, BASE_API_KEY} from '@/config'

const props = defineProps({
  currentBoard: Object
})

const emit = defineEmits([
  'add-column',
  'export-board',
  'delete-task',
  'add-task',
  'refresh-board',
  'drop-column', // Adicione esta linha!,
  'rename-task'
])

const image = ref(null)
const modalColunaVisivel = ref(false)
const nomeColuna = ref('')
const draggedColumnId = ref(null)

function handleDeleteTask(colId, taskId) {
  emit('delete-task', colId, taskId)
  emit('refresh-board', props.currentBoard._id)
}

function renameTask(colId, taskId, newTitle) {
  emit('rename-task', colId, taskId, newTitle)
  emit('refresh-board', props.currentBoard._id)
}

function handleDragColumn(colId) {
  // Guarde o id da coluna sendo arrastada
  draggedColumnId.value = colId
}

function handleDropColumn(targetColId, targetIndex) {
  // Se a coluna de origem e destino forem iguais, não faz nada
  if (draggedColumnId.value === targetColId) return;

  fetch(`${BASE_URL}/api/boards/${props.currentBoard._id}/columns/reorder`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      'x-api-key': BASE_API_KEY
    },
    body: JSON.stringify({
      fromColId: draggedColumnId.value,
      toColId: targetColId,
      toIndex: targetIndex
    })
  })
  .then(resp => resp.json())
  .then(data => {
    emit('refresh-board', props.currentBoard._id)
    draggedColumnId.value = null // Limpa o estado do drag
  })
  .catch(err => {
    console.error('Erro ao reordenar coluna:', err)
  })
}

function handleAddTask(colId, taskTitle) {
  emit('add-task', colId, taskTitle)
  emit('refresh-board', props.currentBoard._id)
}

function onFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    image.value = reader.result
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  image.value = null
}

function abrirModalColuna() {
  nomeColuna.value = ''
  console.log("teste")
  modalColunaVisivel.value = true
}

function fecharModalColuna() {
  modalColunaVisivel.value = false
}

async function confirmarColuna() {
  
  const userToken = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  if (nomeColuna.value.trim()) {
    // Aqui você pode emitir um evento para o pai ou atualizar o board
    // this.$emit('add-column', this.nomeColuna)

    await fetch(`${BASE_URL}/api/columns`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        'x-api-key': BASE_API_KEY
      },
      body: JSON.stringify({
        userId: userId,
        boardId: props.currentBoard._id,
        title: nomeColuna.value
      })
    })
    .then(resp => resp.json())
    .then(data => {
      console.log('Coluna criada:', data)
      emit('refresh-board', props.currentBoard._id)
    })
  }
  fecharModalColuna()
}

function handleDeleteColumn(colId) {
  const userToken = localStorage.getItem('token')
  fetch(`${BASE_URL}/api/columns/${colId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
      'x-api-key': BASE_API_KEY
    }
  })
    .then(resp => resp.json())
    .then(data => {
      console.log('Coluna apagada:', data)
      emit('refresh-board', props.currentBoard._id)
    })
    .catch(err => {
      console.error('Erro ao apagar coluna:', err)
    })
}

function onRenameColumn(colId, newTitle) {
  const userToken = localStorage.getItem('token')
  console.log(colId, newTitle)
  fetch(`${BASE_URL}/api/columns/${colId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
      'x-api-key': BASE_API_KEY
    },
    body: JSON.stringify({ title: newTitle })
  })
    .then(resp => resp.json())
    .then(data => {
      console.log('Coluna renomeada:', data)
      emit('refresh-board', props.currentBoard._id)
    })
    .catch(err => {
      console.error('Erro ao renomear coluna:', err)
    })
}

</script>
