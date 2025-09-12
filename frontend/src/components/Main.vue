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
      v-for="col in currentBoard.columns"
      :key="col._id"
      :column="col"
      @delete-column="handleDeleteColumn"
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
  'refresh-board'
])

const image = ref(null)
const modalColunaVisivel = ref(false)
const nomeColuna = ref('')


function handleDeleteTask(colId, taskId) {
  emit('delete-task', colId, taskId)
}

function handleAddTask(colId) {
  emit('add-task', colId)
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
</script>
