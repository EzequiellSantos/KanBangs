<!-- src/components/Sidebar.vue -->
<template>
  <aside class="sidebar">
    <!-- Logo / Marca -->
    <div class="brand">
      <span>📋</span>
      <span id="brandText">{{ pageTitle }}</span>
    </div>

    <!-- Alternador de tema (usando componente dedicado) -->
    <ThemeToggle />

    <!-- Lista de quadros -->
    <div class="muted small" style="margin-top: 12px;">Quadros</div>
    <BoardList
      :boards="boards"
      :activeBoardId="activeBoardId"
      @select-board="handleBoardSelect"
    />

    <!-- Botões de controle -->
    <div class="controls">
      <button @click="abrirModalNovoQuadro">+ Novo quadro</button>
      <button class="ghost" @click="$emit('import-json')">Importar JSON</button>
      <button class="ghost" @click="deleteBoard">Apagar</button>
      <p v-if="modalNovoQuadroVisivel">O modal de configurações está visível!</p>

    </div>

    <!-- Configurações -->
    <div class="settings-section">
      <button class="ghost" style="width: 100%;" @click="abrirModalConfig">⚙️ Configurações</button>
    </div>

    <!-- Modal para novo quadro -->
    <Modal
      :visible="modalNovoQuadroVisivel"
      title="Novo Quadro"
      @ok="confirmarNovoQuadro"
      @cancel="fecharModalNovoQuadro"
    >
      <input v-model="novoQuadroNome" type="text" placeholder="Nome do quadro" />
      <input v-model="novoQuadroDesc" type="text" placeholder="Descrição do quadro" />
    </Modal>

    <!-- Modal para configurações -->
    <Modal
      :visible="modalConfigVisivel"
      title="Configurações"
      @ok="confirmarConfiguracoes"
      @cancel="fecharModalConfig"
    >
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <label>
          Título da página:
          <input v-model="configTitulo" type="text" />
        </label>
        <label>
          Emoji do favicon:
          <input v-model="configEmoji" type="text" maxlength="2" style="width: 3em;" />
        </label>
        <label>
          URL do Spotify:
          <input v-model="configSpotify" type="url" placeholder="URL do Spotify"/>
        </label>
      </div>
    </Modal>
  </aside>
</template>

<script>
import BoardList from './BoardList.vue'
import ThemeToggle from './ThemeToggle.vue'
import Modal from '@/components/Modal.vue'
import { BASE_URL, BASE_API_KEY } from '@/config'
import { useUIStore } from '@/store/ui'

export default {
  name: 'Sidebar',
  components: {
    BoardList,
    ThemeToggle,
    Modal
  },
  props: {
    boards: Array,
    activeBoardId: [String, Number],
    pageTitle: {
      type: String,
      default: 'Kanban — Domarco'
    }
  },
  data() {
    const uiStore = useUIStore()
    return {
      // Modal Novo Quadro
      modalNovoQuadroVisivel: false,
      novoQuadroNome: '',
      novoQuadroDesc: '',

      // Modal Configurações
      modalConfigVisivel: false,
      configTitulo: 'Kanban — Domarco',
      configEmoji: '📋',
      configSpotify: '',
      apiUrl: BASE_URL,
      apiKey: BASE_API_KEY,
      userToken: localStorage.getItem('token'),
      userId: uiStore.userId
    }
  },
  mounted() {
    this.carregarQuadros()
  },
  methods: {
    // Novo Quadro
    carregarQuadros() {
      this.$emit('carregar-boards')
    },
    abrirModalNovoQuadro() {
      this.novoQuadroNome = ''
      this.modalNovoQuadroVisivel = true
    },
    fecharModalNovoQuadro() {
      this.modalNovoQuadroVisivel = false
    },
    async confirmarNovoQuadro() {
      await fetch(`${this.apiUrl}/api/boards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.userToken}`,
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          userId: this.userToken,
          title: this.novoQuadroNome,
          desc: this.novoQuadroDesc
        })
      })
      this.fecharModalNovoQuadro()
      this.carregarQuadros()
    },
    abrirModalConfig() {
      this.modalConfigVisivel = true
    },
    fecharModalConfig() {
      this.modalConfigVisivel = false
    },
    confirmarConfiguracoes() {
      this.fecharModalConfig()
    },
    handleBoardSelect(boardId) {
      this.$emit('select-board', boardId)
      // Se quiser, pode atualizar o activeBoardId localmente também
      // this.activeBoardId = boardId
      console.log('Board selecionado:', boardId)
    },
    deleteBoard() {
      if (this.activeBoardId) {
        this.$emit('delete-board', this.activeBoardId)
      }
    }
  }
}
</script>