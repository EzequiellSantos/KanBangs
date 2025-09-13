<template>
  <section
    class="column"
    :data-col-id="column._id"
    @drop="onDropColumn"
    @dragover.prevent
  >
    <!-- Cabeçalho -->
    <div class="column-header">
      <div>
        <div class="column-title">{{ column.title }}</div>
        <div class="column-count">{{ column.tasks.length }} tarefas</div>
      </div>
      <div style="display: flex; gap: 4px">
        <button class="ghost" title="Arrastar coluna" draggable="true" @dragstart="startColumnDrag" @dragend="endColumnDrag">⋮⋮</button>
        <button class="ghost" title="Adicionar tarefa" @click="modalNovaVisivel = true">+</button>
        <button class="ghost" title="Menu da coluna" @click="toggleMenu">⋯</button>
      </div>
    </div>

    <!-- Tarefas -->
    <div class="tasks" @dragenter="onDragEnter" @dragleave="onDragLeave" @dragover.prevent @drop="onDrop">
      <div
        v-for="task in column.tasks"
        :key="task._id"
        :class="['task', { dragging: isDragging }]"
        draggable="true"
        @dragstart="startTaskDrag(task._id), isDragging = true"
        @dragend="endTaskDrag, isDragging = false"
        @dblclick="abrirModalEditarTarefa(task)"
      >
        {{ task.title }}
        <div class="task-actions">
          <button class="delete-task" @click="onDeleteTask(task._id)">×</button>
        </div>
      </div>
    </div>

    <!-- Modal: Nova Tarefa -->
    <Modal
      :visible="modalNovaVisivel"
      title="Nova Tarefa"
      @ok="confirmarNovaTarefa"
      @cancel="modalNovaVisivel = false"
    >
      <input v-model="novaTarefaTitulo" type="text" placeholder="Título da nova tarefa" />
    </Modal>

    <!-- Modal: Editar Tarefa -->
    <Modal
      :visible="modalEditarVisivel"
      title="Editar Tarefa"
      @ok="confirmarEditarTarefa"
      @cancel="modalEditarVisivel = false"
    >
      <input v-model="tarefaEditandoTitulo" type="text" placeholder="Novo título da tarefa" />
    </Modal>

    <!-- Modal: Renomear Coluna -->
    <Modal
      :visible="modalRenomearVisivel"
      title="Renomear Coluna"
      @ok="confirmarRenomearColuna"
      @cancel="modalRenomearVisivel = false"
    >
      <input v-model="novoTituloColuna" type="text" placeholder="Novo título da coluna" />
    </Modal>

    <!-- Rodapé -->
    <div class="column-footer">Arraste tarefas aqui</div>

    <!-- Menu de opções da coluna -->
    <div v-if="menuVisible" class="column-menu">
      <button class="ghost" @click="onRenameColumn">Renomear</button>
      <button class="ghost" style="color: #ef4444" @click="onDeleteColumn">Apagar</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import Modal from './Modal.vue'

const props = defineProps({
  column: Object
})

const emit = defineEmits([
  'delete-task',
  'delete-column',
  'rename-column',
  'add-task',
  'edit-task',
  'move-task',
  'drag-column'
])

// ▼ Modal: Nova Tarefa
const modalNovaVisivel = ref(false)
const novaTarefaTitulo = ref('')

// ▼ Modal: Editar Tarefa
const modalEditarVisivel = ref(false)
const tarefaEditando = ref(null)
const tarefaEditandoTitulo = ref('')

// ▼ Modal: Renomear Coluna
const modalRenomearVisivel = ref(false)
const novoTituloColuna = ref('')

// ▼ Menu da coluna
const menuVisible = ref(false)
function toggleMenu() {
  menuVisible.value = !menuVisible.value
}

// ▼ Criar tarefa
function confirmarNovaTarefa() {
  if (novaTarefaTitulo.value.trim()) {
    emit('add-task', props.column._id, novaTarefaTitulo.value.trim())
    novaTarefaTitulo.value = ''
  }
  modalNovaVisivel.value = false
}

// ▼ Editar tarefa
function abrirModalEditarTarefa(task) {
  tarefaEditando.value = task
  tarefaEditandoTitulo.value = task.title
  modalEditarVisivel.value = true
}

function confirmarEditarTarefa() {
  if (tarefaEditandoTitulo.value.trim()) {
    emit('edit-task', props.column._id, tarefaEditando.value._id, tarefaEditandoTitulo.value.trim())
  }
  modalEditarVisivel.value = false
}

// ▼ Renomear coluna
function onRenameColumn() {
  novoTituloColuna.value = props.column.title
  modalRenomearVisivel.value = true
}

function confirmarRenomearColuna() {
  if (novoTituloColuna.value.trim()) {
    emit('rename-column', props.column._id, novoTituloColuna.value.trim())
  }
  modalRenomearVisivel.value = false
}

// ▼ Apagar tarefa
function onDeleteTask(taskId) {
  if (confirm('Apagar esta tarefa?')) {
    emit('delete-task', props.column._id, taskId)
  }
}

// ▼ Apagar coluna
function onDeleteColumn() {
  if (confirm('Apagar esta coluna e todas as suas tarefas?')) {
    emit('delete-column', props.column._id);
  }
}

// ▼ Drag and drop para tarefa
function startTaskDrag(taskId) {
  const payload = {
    type: 'task',
    taskId,
    fromCol: props.column._id
  }
  
  event.dataTransfer.setData('text/plain', JSON.stringify(payload))
  event.dataTransfer.effectAllowed = 'move'
}
function endTaskDrag() {}

let dragCounter = 0
function onDragEnter() {
  dragCounter++
  event.currentTarget.classList.add('drop-hint')
}
function onDragLeave() {
  dragCounter--
  if (dragCounter === 0) {
    event.currentTarget.classList.remove('drop-hint')
  }
}
function onDrop(event) {
  dragCounter = 0
  event.currentTarget.classList.remove('drop-hint')
  try {
    const payload = JSON.parse(event.dataTransfer.getData('text/plain'))
    if (payload.type === 'task') {
      const toColId = props.column._id
      const tasksWrap = event.currentTarget
      const rect = tasksWrap.getBoundingClientRect()
      const y = event.clientY - rect.top

      let index = 0
      let cumulative = 0
      // Só considera elementos com a classe .task
      const children = Array.from(tasksWrap.querySelectorAll('.task'))

      for (let i = 0; i < children.length; i++) {
        const height = children[i].getBoundingClientRect().height + 8
        if (y > cumulative + height / 2) index = i + 1
        cumulative += height
      }

      emit('move-task', payload.fromCol, toColId, payload.taskId, index)

    }
  } catch (err) {
    console.error('Erro ao processar drop:', err)
  }
}

// ▼ Drag and drop para coluna
function startColumnDrag(event) {
  event.dataTransfer.setData('text/plain', JSON.stringify({
    type: 'column',
    colId: props.column._id
  }))
  event.currentTarget.closest('.column').style.opacity = '0.5'
  emit('drag-column', props.column._id)
}
function endColumnDrag(event) {
  event.currentTarget.closest('.column').style.opacity = '1'
}
function onDropColumn(event) {
  const payload = JSON.parse(event.dataTransfer.getData('text/plain'))
  if (payload.type === 'column') {
    // O índice já está correto via props.columnIndex
    emit('drop-column', props.column._id, props.columnIndex)
  }
}
</script>

<style scoped>
</style>
